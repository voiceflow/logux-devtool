import { Version } from "../types";

export interface SessionState {
  versions: Version[];
  ports: {
    host?: chrome.runtime.Port;
    panel?: chrome.runtime.Port;
  };
}

export type State = Partial<Record<string, SessionState>>;

const state: State = {};

export default state;

export const obtainSessionState = (tabID: string) => {
  const sessionState = state[tabID] ?? {
    versions: [],
    ports: {},
  };

  state[tabID] ??= sessionState;

  return sessionState;
};
