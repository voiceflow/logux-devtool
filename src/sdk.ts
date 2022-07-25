import { HOST_KEY, SERVICE_KEY, PANEL_KEY } from "./constants";
import { Version } from "./types";

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

/* service actions */

export const acknowledge = serviceAction("ACKNOWLEDGE");

export const replaceVersions = serviceAction<Version[]>("REPLACE_VERSIONS");
export const addVersion = serviceAction<Version>("ADD_VERSION");

/* panel actions */

export const initPanel = panelAction<{ tabID: string }>("INIT");
