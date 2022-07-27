import {
  acknowledge,
  addEntry,
  addVersion,
  logValue,
  initPanel,
  recordDispatch,
  recordReplay,
  replaceVersions,
} from "../sdk";
import { Version, Entry } from "../types";
import { obtainSessionState, SessionState } from "./state";
import { nanoid } from "https://unpkg.com/nanoid@4.0.0/index.browser.js";

export const registerHostPort = (port: chrome.runtime.Port) => {
  const tabID = port.sender?.tab?.id;
  if (!tabID) throw new Error("expected tab ID");

  const sessionState = obtainSessionState(String(tabID));
  sessionState.ports.host = port;

  const handleRecordReplay = ({ payload }: ReturnType<typeof recordReplay>) => {
    const latestVersion =
      sessionState.versions[sessionState.versions.length - 1];
    const nextVersion: Version = {
      id: nanoid(),
      label: `v${sessionState.versions.length}`,
      entries: payload.entries.map<Entry>(([id, action, state], index) => {
        const blame = !latestVersion.entries.some((entry) => entry.id === id);

        if (index === 0) {
          return {
            id,
            action,
            prevState: undefined,
            nextState: state,
            blame,
          };
        }

        return {
          id,
          action,
          prevState: payload.entries[index - 1][2],
          nextState: state,
          blame,
        };
      }),
    };

    sessionState.versions.push(nextVersion);
    sessionState.ports.panel?.postMessage(addVersion(nextVersion));
  };

  const handleRecordDispatch = ({
    payload,
  }: ReturnType<typeof recordDispatch>) => {
    const latestVersion =
      sessionState.versions[sessionState.versions.length - 1];
    if (latestVersion) {
      const entry: Entry = {
        id: payload.id,
        action: payload.action,
        prevState:
          latestVersion.entries[latestVersion.entries.length - 1].nextState,
        nextState: payload.state,
        blame: false,
      };
      latestVersion.entries.push(entry);
      sessionState.ports.panel?.postMessage(
        addEntry({ versionID: latestVersion.id, entry })
      );
    } else {
      const firstVersion: Version = {
        id: nanoid(),
        label: "v0",
        entries: [
          {
            id: payload.id,
            action: payload.action,
            prevState: undefined,
            nextState: payload.state,
            blame: false,
          },
        ],
      };

      sessionState.versions.push(firstVersion);
      sessionState.ports.panel?.postMessage(addVersion(firstVersion));
    }
  };

  const messageHandler = (action: AnyAction) => {
    if (recordReplay.match(action)) {
      handleRecordReplay(action);
    } else if (recordDispatch.match(action)) {
      handleRecordDispatch(action);
    } else {
      console.warn("unexpected host message");
    }

    port.postMessage(acknowledge());
  };

  port.onMessage.addListener(messageHandler);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(messageHandler);
    delete sessionState.ports.host;
  });
};

export const registerPanelPort = (port: chrome.runtime.Port) => {
  let sessionState: SessionState | null = null;

  const handleInitPanel = (action: ReturnType<typeof initPanel>) => {
    const { tabID } = action.payload;

    sessionState = obtainSessionState(String(tabID));
    sessionState.ports.panel = port;

    // add all missing versions
    port.postMessage(replaceVersions(sessionState.versions));
  };

  const handleLogValue = (action: ReturnType<typeof logValue>) => {
    sessionState?.ports.host?.postMessage(action);
  };

  const messageHandler = (action: AnyAction) => {
    if (initPanel.match(action)) {
      handleInitPanel(action);
    } else if (logValue.match(action)) {
      handleLogValue(action);
    } else {
      console.warn("unexpected panel message");
    }

    port.postMessage(acknowledge());
  };

  port.onMessage.addListener(messageHandler);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(messageHandler);
    delete sessionState?.ports.panel;
  });
};
