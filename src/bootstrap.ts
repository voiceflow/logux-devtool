import { acknowledge, logValue, recordDispatch, recordReplay } from "./sdk";
import { nanoid } from "https://unpkg.com/nanoid@4.0.0/index.browser.js";

const LOGUX_EVENT = "logux_message";
const LOGUX_NOTIFY = "logux_notify";

const tabID = nanoid();

const createEvent = (action: AnyAction) =>
  new CustomEvent<{ action: AnyAction }>(LOGUX_EVENT, {
    detail: { action },
  });

window.__LOGUX_DEVTOOL__ = {
  recordReplay: (entries) => {
    document.dispatchEvent(createEvent(recordReplay({ tabID, entries })));
  },
  recordDispatch: (id, action, state) => {
    document.dispatchEvent(
      createEvent(recordDispatch({ tabID, id, action, state }))
    );
  },
};

document.addEventListener(LOGUX_NOTIFY, (event) => {
  const {
    detail: { action },
  } = event as CustomEvent<{ action: AnyAction }>;

  if (acknowledge.match(action)) return;

  if (logValue.match(action)) {
    console.info("from logux devtools", action.payload.value);
  } else {
    console.warn("unexpected notification", action);
  }
});
