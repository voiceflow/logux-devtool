import { HOST_KEY, SERVICE_KEY } from "./constants";

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

const hostAction = actionCreatorFactory(`@@${HOST_KEY}`);
const serviceAction = actionCreatorFactory(`@@${SERVICE_KEY}`);

/* host actions */

export const logAdd = hostAction<{ message: AnyAction }>("LOG_ADD");

/* service actions */

export const acknowledge = serviceAction("ACKNOWLEDGE");

/* panel actions */

export const addVersion = serviceAction<{
  id: string;
  entries: [AnyAction, AnyRecord][];
}>("ADD_VERSION");
