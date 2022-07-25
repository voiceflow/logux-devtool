import { HOST_KEY, PANEL_KEY } from "./constants";
import {
  acknowledge,
  addVersion,
  logAdd,
  replaceVersions,
  replayLog,
} from "./sdk";
import { Version } from "./types";

interface State {
  versions: Version[];
}

const state: State = { versions: [] };

let hostPort: chrome.runtime.Port | null = null;
let panelPort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === HOST_KEY) {
    hostPort = port;
    hostPort.onMessage.addListener(function (action: AnyAction) {
      if (logAdd.match(action)) {
        const version: Version = {
          id: String(Date.now()),
          label: new Date().toISOString().split("T")[1],
          entries: [[action.payload.message, { who: "knows" }]],
        };

        state.versions.push(version);
        panelPort?.postMessage(addVersion(version));
      } else if (replayLog.match(action)) {
        const version: Version = {
          id: String(Date.now()),
          label: new Date().toISOString().split("T")[1],
          entries: action.payload.actions.map((a) => [a, { who: "knows" }]),
        };

        state.versions.push(version);
        panelPort?.postMessage(addVersion(version));
      } else {
        console.warn("unexpected host message");
      }

      hostPort?.postMessage(acknowledge());
    });
  } else if (port.name === PANEL_KEY) {
    panelPort = port;
    panelPort.onMessage.addListener(function (action: AnyAction) {
      console.warn("unexpected panel message");

      panelPort?.postMessage(acknowledge());
    });

    // add all missing versions
    panelPort.postMessage(replaceVersions(state.versions));
  }
});
