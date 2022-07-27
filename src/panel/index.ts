import { addEntry, addVersion, initPanel, replaceVersions } from "../sdk";
import { appendVersions, appendEntry } from "./utils/index";
import client from "./client";

client.onMessage((action: AnyAction) => {
  if (addVersion.match(action)) {
    appendVersions(action.payload);
  } else if (addEntry.match(action)) {
    appendEntry(action.payload.versionID, action.payload.entry);
  } else if (replaceVersions.match(action)) {
    appendVersions(...action.payload);
  }
});

client.sendMessage(
  initPanel({ tabID: String(chrome.devtools.inspectedWindow.tabId) })
);
