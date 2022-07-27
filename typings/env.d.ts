interface Window {
  __LOGUX_DEVTOOL__: {
    recordReplay: (entries: [string, AnyAction, AnyRecord][]) => void;
    recordDispatch: (id: string, action: AnyAction, state: AnyRecord) => void;
  };
}

type AnyRecord = Record<string, any>;

type AnyAction = { type: string };

interface Action<Payload> extends AnyAction {
  payload: Payload;
}
