export type Entry = [AnyAction, AnyRecord | undefined, AnyRecord];

export interface Version {
  id: string;
  label: string;
  entries: Entry[];
}
