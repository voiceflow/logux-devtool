interface Window {
  __LOGUX_DEVTOOL__: {
    logAdd: (action: AnyAction) => void;
    replayLog: (actions: AnyAction[]) => void;

    recordReplay: (entries: [AnyAction, AnyRecord][]) => void;
    recordDispatch: (action: AnyAction, state: AnyRecord) => void;
  };
}

type AnyRecord = Record<string, any>;

type AnyAction = { type: string };

interface Action<Payload> extends AnyAction {
  payload: Payload;
}
