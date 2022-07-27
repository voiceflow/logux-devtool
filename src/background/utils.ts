import {
  acknowledge,
  addEntry,
  addVersion,
  initPanel,
  recordDispatch,
  recordReplay,
  replaceVersions,
} from "../sdk";
import { Version, Entry } from "../types";
import { obtainSessionState } from "./state";
import { nanoid } from "https://unpkg.com/nanoid@4.0.0/index.browser.js";

export const registerHostPort = (port: chrome.runtime.Port) => {
  const tabID = port.sender?.tab?.id;
  if (!tabID) throw new Error("expected tab ID");

  const sessionState = obtainSessionState(String(tabID));
  sessionState.ports.host = port;

  const handleRecordReplay = ({ payload }: ReturnType<typeof recordReplay>) => {
    const version: Version = {
      id: nanoid(),
      label: `v${sessionState.versions.length}`,
      entries: payload.entries.map(([action, state], index) => {
        if (index === 0) return [action, undefined, state];

        return [action, payload.entries[index - 1][1], state];
      }),
    };

    sessionState.versions.push(version);
    sessionState.ports.panel?.postMessage(addVersion(version));
  };

  const handleRecordDispatch = ({
    payload,
  }: ReturnType<typeof recordDispatch>) => {
    const latestVersion =
      sessionState.versions[sessionState.versions.length - 1];
    if (latestVersion) {
      const entry: Entry = [
        payload.action,
        latestVersion.entries[latestVersion.entries.length - 1][2],
        payload.state,
      ];
      latestVersion.entries.push(entry);
      sessionState.ports.panel?.postMessage(
        addEntry({ versionID: latestVersion.id, entry })
      );
    } else {
      const firstVersion: Version = {
        id: nanoid(),
        label: "v0",
        entries: [[payload.action, undefined, payload.state]],
      };
      sessionState.versions.push(firstVersion);
      sessionState.ports.panel?.postMessage(addVersion(firstVersion));
    }
  };

  port.onMessage.addListener(function (action: AnyAction) {
    if (recordReplay.match(action)) {
      handleRecordReplay(action);
    } else if (recordDispatch.match(action)) {
      handleRecordDispatch(action);
    } else {
      console.warn("unexpected host message");
    }

    port.postMessage(acknowledge());
  });
};

export const registerPanelPort = (port: chrome.runtime.Port) => {
  let tabID: string | null = null;

  port.onMessage.addListener(function (action: AnyAction) {
    if (initPanel.match(action)) {
      tabID = action.payload.tabID;

      const sessionState = obtainSessionState(String(tabID));
      sessionState.ports.panel = port;

      // add all missing versions
      port.postMessage(replaceVersions(sessionState.versions));
    } else {
      console.warn("unexpected panel message");
    }

    port.postMessage(acknowledge());
  });
};
