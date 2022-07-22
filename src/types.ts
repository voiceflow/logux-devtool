export type Entry = [AnyAction, AnyRecord];

export interface Version {
  id: string;
  label: string;
  entries: Entry[];
}
