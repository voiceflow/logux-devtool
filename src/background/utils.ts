import {
  acknowledge,
  addVersion,
  initPanel,
  logAdd,
  replaceVersions,
  replayLog,
} from "../sdk";
import { Version } from "../types";
import { obtainSessionState } from "./state";

export const registerHostPort = (port: chrome.runtime.Port) => {
  const tabID = port.sender?.tab?.id;
  if (!tabID) throw new Error("expected tab ID");

  const sessionState = obtainSessionState(String(tabID));
  sessionState.ports.host = port;

  port.onMessage.addListener(function (action: AnyAction) {
    if (logAdd.match(action)) {
      const version: Version = {
        id: String(Date.now()),
        label: new Date().toISOString().split("T")[1],
        entries: [[action.payload.message, { who: "knows" }]],
      };

      sessionState.versions.push(version);
      sessionState.ports.panel?.postMessage(addVersion(version));
    } else if (replayLog.match(action)) {
      const version: Version = {
        id: String(Date.now()),
        label: new Date().toISOString().split("T")[1],
        entries: action.payload.actions.map((a) => [a, { who: "knows" }]),
      };

      sessionState.versions.push(version);
      sessionState.ports.panel?.postMessage(addVersion(version));
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
