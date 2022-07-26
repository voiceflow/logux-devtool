import { Version } from "../types";

interface State {
  activeVersion: Version | null;
  activeEntry: number | null;
  versions: Partial<Record<string, Version>>;
}

const state: State = {
  activeVersion: null,
  activeEntry: null,
  versions: {},
};

export default state;
