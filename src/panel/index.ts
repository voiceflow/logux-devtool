import { PANEL_KEY } from "../constants";
import { addEntry, addVersion, initPanel, replaceVersions } from "../sdk";
import { appendVersions, appendEntry } from "./utils/index";

const port = chrome.runtime.connect({ name: PANEL_KEY });

port.onMessage.addListener((action: AnyAction) => {
  if (addVersion.match(action)) {
    appendVersions(action.payload);
  } else if (addEntry.match(action)) {
    appendEntry(action.payload.versionID, action.payload.entry);
  } else if (replaceVersions.match(action)) {
    appendVersions(...action.payload);
  }
});

port.postMessage(
  initPanel({ tabID: String(chrome.devtools.inspectedWindow.tabId) })
);
