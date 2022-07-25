import { logAdd, replayLog } from "./sdk";

const createEvent = (action: AnyAction) =>
  new CustomEvent<{ action: AnyAction }>("logux_message", {
    detail: { action },
  });

window.__LOGUX_DEVTOOL__ = {
  logAdd: (message) => {
    document.dispatchEvent(createEvent(logAdd({ message })));
  },
  replayLog: (actions) => {
    document.dispatchEvent(createEvent(replayLog({ actions })));
  },
};
