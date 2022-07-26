export const $different = Symbol();
export const $added = Symbol();
export const $removed = Symbol();
export const $changed = Symbol();

export type DiffableObject = { [key: string]: Diffable };
export type Container = Diffable[] | DiffableObject;
export type Primitive = undefined | null | boolean | number | string;
export type Diffable = Primitive | Container;

export type DiffResult =
  | Diffable
  | {
      [$added]?: Diffable;
      [$removed]?: Diffable;
      [$changed]?: [Diffable, Diffable];
      [$different]?: true;
    }
  | (Array<DiffResult> & { [$different]?: true })
  | {
      [key: string]: DiffResult;
      [$different]?: true;
    };

const transactionGuard =
  <T extends symbol, R = Diffable>(sym: T) =>
  (value: any): value is Record<T, R> =>
    !!value && Object.hasOwn(value, sym);

export const isAdded = transactionGuard($added);
export const isRemoved = transactionGuard($removed);
export const isChanged = transactionGuard<
  typeof $changed,
  [Diffable, Diffable]
>($changed);
export const isDifferent = transactionGuard($different);

export const tagDifferent = (value: any) =>
  Object.assign(value, { [$different]: true });
export const tagAdded = (value: any) => tagDifferent({ [$added]: value });
export const tagRemoved = (value: any) => tagDifferent({ [$removed]: value });
export const tagChanged = (prev: any, next: any) =>
  tagDifferent({ [$changed]: [prev, next] });

export const getAdded = ({ [$added]: added }: { [$added]: Diffable }) => added;
export const getRemoved = ({ [$removed]: removed }: { [$removed]: Diffable }) =>
  removed;
export const getChanged = ({
  [$changed]: changed,
}: {
  [$changed]: [Diffable, Diffable];
}) => changed;
