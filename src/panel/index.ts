import { PANEL_KEY } from "../constants";
import { addEntry, addVersion, initPanel, replaceVersions } from "../sdk";
import { appendVersions, appendEntry } from "./utils/index";

const panelPort = chrome.runtime.connect({ name: PANEL_KEY });

panelPort.onMessage.addListener((action: AnyAction) => {
  if (addVersion.match(action)) {
    appendVersions(action.payload);
  } else if (addEntry.match(action)) {
    appendEntry(action.payload.versionID, action.payload.entry);
  } else if (replaceVersions.match(action)) {
    appendVersions(...action.payload);
  }
});

panelPort.postMessage(
  initPanel({ tabID: String(chrome.devtools.inspectedWindow.tabId) })
);
