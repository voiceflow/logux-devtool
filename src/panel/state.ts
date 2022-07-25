import { Version } from "../types";

interface State {
  activeVersion: Version | null;
  activeEntry: number | null;
}

const state: State = {
  activeVersion: null,
  activeEntry: null,
};

export default state;
