interface Window {
  __LOGUX_DEVTOOL__: {
    logAdd: (action: AnyAction) => void;
  };
}

type AnyRecord = Record<string, any>;

type AnyAction = { type: string };

interface Action<Payload> extends AnyAction {
  payload: Payload;
}
