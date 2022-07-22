import { HOST_KEY, PANEL_KEY } from "./constants";
import { acknowledge, addVersion, logAdd } from "./sdk";

let hostPort: chrome.runtime.Port | null = null;
let panelPort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === HOST_KEY) {
    hostPort = port;
    hostPort.onMessage.addListener(function (action: AnyAction) {
      if (logAdd.match(action)) {
        console.log("adding to log", action.payload.message);
        panelPort?.postMessage(
          addVersion({ id: "123", entries: [[action, { who: "knows" }]] })
        );
      } else {
        console.log("unknown");
      }

      hostPort?.postMessage(acknowledge());
    });
  } else if (port.name === PANEL_KEY) {
    panelPort = port;
    panelPort.onMessage.addListener(function (action: AnyAction) {
      console.log("got message from devtool panel");
      // if (logAdd.match(action)) {
      //   console.log("adding to log", action.payload.message);
      // } else {
      //   console.log("unknown");
      // }
      // // console.log(JSON.stringify(msg));
      // // port.postMessage({ question: "Who's there?" });
      // // port.postMessage({ question: "abc" });
      // port.postMessage(acknowledge());
    });
  }
});
