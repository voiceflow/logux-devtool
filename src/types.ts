export type Entry = [AnyAction, AnyRecord];

export interface Version {
  id: string;
  entries: Entry[];
}
