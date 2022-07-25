import { HOST_KEY, PANEL_KEY } from "../constants";
import { registerHostPort, registerPanelPort } from "./utils";

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === HOST_KEY) {
    registerHostPort(port);
  } else if (port.name === PANEL_KEY) {
    registerPanelPort(port);
  }
});
