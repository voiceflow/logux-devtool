import { PANEL_KEY } from "../constants";

const port = chrome.runtime.connect({ name: PANEL_KEY });

const client = {
  onMessage: (handler: (action: AnyAction) => void) =>
    port.onMessage.addListener(handler),
  sendMessage: (action: AnyAction) => port.postMessage(action),
};

export default client;
