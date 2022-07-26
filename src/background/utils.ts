import {
  acknowledge,
  addEntry,
  addVersion,
  initPanel,
  logAdd,
  recordDispatch,
  recordReplay,
  replaceVersions,
  replayLog,
} from "../sdk";
import { Version, Entry } from "../types";
import { obtainSessionState } from "./state";
import { nanoid } from "https://unpkg.com/nanoid@4.0.0/index.browser.js";

export const registerHostPort = (port: chrome.runtime.Port) => {
  const tabID = port.sender?.tab?.id;
  if (!tabID) throw new Error("expected tab ID");

  const sessionState = obtainSessionState(String(tabID));
  sessionState.ports.host = port;

  const handleLogAdd = ({ payload }: ReturnType<typeof logAdd>) => {
    const version: Version = {
      id: nanoid(),
      label: `v${sessionState.versions.length + 1}`,
      entries: [[payload.message, { who: "knows" }]],
    };

    sessionState.versions.push(version);
    sessionState.ports.panel?.postMessage(addVersion(version));
  };

  const handleReplayLog = ({ payload }: ReturnType<typeof replayLog>) => {
    const version: Version = {
      id: nanoid(),
      label: `v${sessionState.versions.length + 1}`,
      entries: payload.actions.map((action) => [action, { who: "knows" }]),
    };

    sessionState.versions.push(version);
    sessionState.ports.panel?.postMessage(addVersion(version));
  };

  const handleRecordReplay = ({ payload }: ReturnType<typeof recordReplay>) => {
    const version: Version = {
      id: nanoid(),
      label: `v${sessionState.versions.length + 1}`,
      entries: payload.entries,
    };

    sessionState.versions.push(version);
    sessionState.ports.panel?.postMessage(addVersion(version));
  };

  const handleRecordDispatch = ({
    payload,
  }: ReturnType<typeof recordDispatch>) => {
    const entry: Entry = [payload.action, payload.state];

    const latestVersion =
      sessionState.versions[sessionState.versions.length - 1];
    if (!latestVersion) return;

    latestVersion.entries.push(entry);
    sessionState.ports.panel?.postMessage(
      addEntry({ versionID: latestVersion.id, entry })
    );
  };

  port.onMessage.addListener(function (action: AnyAction) {
    if (logAdd.match(action)) {
      handleLogAdd(action);
    } else if (replayLog.match(action)) {
      handleReplayLog(action);
    } else if (recordReplay.match(action)) {
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
