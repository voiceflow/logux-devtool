import { PANEL_KEY } from "./constants";

const panelPort = chrome.runtime.connect({ name: PANEL_KEY });

panelPort.onMessage.addListener((msg: AnyAction) => {
  console.log("got message from service worker", msg);
});
