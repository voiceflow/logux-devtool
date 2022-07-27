import {
  Diffable,
  DiffableObject,
  DiffResult,
  isDifferent,
  tagAdded,
  tagChanged,
  tagDifferent,
  tagRemoved,
} from "./result";
export * from "./result";

enum Type {
  UNDEFINED = "undefined",
  NULL = "null",
  BOOLEAN = "boolean",
  NUMBER = "number",
  STRING = "string",
  ARRAY = "array",
  OBJECT = "object",
}

const getType = (value: any) => {
  switch (true) {
    case value === undefined:
      return Type.UNDEFINED;
    case value === null:
      return Type.NULL;
    case Array.isArray(value):
      return Type.ARRAY;
    default:
      switch (typeof value) {
        case "boolean":
          return Type.BOOLEAN;
        case "number":
          return Type.NUMBER;
        case "string":
          return Type.STRING;
        default:
          return Type.OBJECT;
      }
  }
};

const isNullish = (type: Type) => type === Type.UNDEFINED || type === Type.NULL;
const arrayGuard = (_value: any, type: Type): _value is Diffable[] =>
  type === Type.ARRAY;
const objectGuard = (_value: any, type: Type): _value is DiffableObject =>
  type === Type.OBJECT;

export function arrayDiff(prev: Diffable[], next: Diffable[]): DiffResult {
  const prevEmpty = !prev.length;
  const nextEmpty = !next.length;

  if (prevEmpty && nextEmpty) return [];
  if (prevEmpty) return tagDifferent(next.map(tagAdded));
  if (nextEmpty) return tagDifferent(prev.map(tagRemoved));

  let hasChange = false;
  if (prev.length >= next.length) {
    const root = prev.map((prevValue, index) => {
      if (index >= next.length) {
        hasChange = true;
        return tagRemoved(prevValue);
      }

      const result = diff(prevValue, next[index]);
      hasChange ||= isDifferent(result);
      return result;
    });

    return hasChange ? tagDifferent(root) : root;
  } else {
    const root = next.map((nextValue, index) => {
      if (index >= next.length) {
        hasChange = true;
        return tagAdded(nextValue);
      }

      const result = diff(prev[index], nextValue);
      hasChange ||= isDifferent(result);
      return result;
    });

    return hasChange ? tagDifferent(root) : root;
  }
}

export function objectDiff(
  prev: DiffableObject,
  next: DiffableObject
): DiffResult {
  const root: DiffableObject = {};

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  const allKeys = new Set([...prevKeys, ...nextKeys]);

  let hasChange = false;
  allKeys.forEach((key) => {
    const hasPrev = Object.hasOwn(prev, key);
    const hasNext = Object.hasOwn(next, key);

    if (hasPrev && hasNext) {
      const result = diff(prev[key], next[key]);

      root[key] = result;
      hasChange ||= isDifferent(result);
    } else if (hasPrev) {
      root[key] = tagRemoved(prev[key]);
      hasChange = true;
    } else if (hasNext) {
      root[key] = tagAdded(next[key]);
      hasChange = true;
    }
  });

  if (hasChange) return tagDifferent(root);

  // no change
  return root;
}

export function diff(prev: Diffable, next: Diffable): DiffResult {
  if (prev === next) return next;

  const prevType = getType(prev);
  const nextType = getType(next);

  if (isNullish(prevType) || isNullish(nextType)) {
    // fall-through
  } else if (arrayGuard(prev, prevType) && arrayGuard(next, nextType)) {
    return arrayDiff(prev, next);
  } else if (objectGuard(prev, prevType) && objectGuard(next, nextType)) {
    return objectDiff(prev, next);
  }

  return tagChanged(prev, next);
}
