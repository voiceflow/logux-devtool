export interface Entry {
  id: string;
  action: AnyAction;
  prevState: AnyRecord | undefined;
  nextState: AnyRecord;
  blame: boolean;
}

export interface Version {
  id: string;
  label: string;
  entries: Entry[];
}
