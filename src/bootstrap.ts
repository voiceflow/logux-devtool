import { logAdd, recordDispatch, recordReplay, replayLog } from "./sdk";
import { nanoid } from "https://unpkg.com/nanoid@4.0.0/index.browser.js";

const tabID = nanoid();

const createEvent = (action: AnyAction) =>
  new CustomEvent<{ action: AnyAction }>("logux_message", {
    detail: { action },
  });

window.__LOGUX_DEVTOOL__ = {
  logAdd: (message) => {
    document.dispatchEvent(createEvent(logAdd({ tabID, message })));
  },
  replayLog: (actions) => {
    document.dispatchEvent(createEvent(replayLog({ tabID, actions })));
  },

  recordReplay: (entries) => {
    document.dispatchEvent(createEvent(recordReplay({ tabID, entries })));
  },
  recordDispatch: (action, state) => {
    document.dispatchEvent(
      createEvent(recordDispatch({ tabID, action, state }))
    );
  },
};
