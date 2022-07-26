import { HOST_KEY, SERVICE_KEY, PANEL_KEY } from "./constants";
import { Version, Entry } from "./types";

const actionCreatorFactory =
  (prefix: string) =>
  <T = void>(type: string) => {
    const fullType = `${prefix}/${type}`;

    return Object.assign((payload: T) => ({ type: fullType, payload }), {
      type: fullType,
      match: (action: AnyAction): action is Action<T> =>
        action.type === fullType,
    });
  };

/**
 * factory for actions sent by the host window
 */
const hostAction = actionCreatorFactory(`@@${HOST_KEY}`);

/**
 * factory for actions sent by the service worker
 */
const serviceAction = actionCreatorFactory(`@@${SERVICE_KEY}`);

/**
 * factory for actions sent by the devtool panel
 */
const panelAction = actionCreatorFactory(`@@${PANEL_KEY}`);

/* host actions */

export const logAdd = hostAction<{ tabID: string; message: AnyAction }>(
  "LOG_ADD"
);
export const replayLog = hostAction<{ tabID: string; actions: AnyAction[] }>(
  "REPLAY_LOG"
);

export const recordReplay = hostAction<{
  tabID: string;
  entries: [AnyAction, AnyRecord][];
}>("RECORD_REPLAY");
export const recordDispatch = hostAction<{
  tabID: string;
  action: AnyAction;
  state: AnyRecord;
}>("RECORD_DISPATCH");

/* service actions */

export const acknowledge = serviceAction("ACKNOWLEDGE");

export const replaceVersions = serviceAction<Version[]>("REPLACE_VERSIONS");
export const addVersion = serviceAction<Version>("ADD_VERSION");
export const addEntry = serviceAction<{ versionID: string; entry: Entry }>(
  "ADD_ENTRY"
);

/* panel actions */

export const initPanel = panelAction<{ tabID: string }>("INIT");
