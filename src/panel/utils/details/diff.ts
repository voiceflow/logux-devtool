import {
  isAdded,
  isRemoved,
  isChanged,
  getAdded,
  getRemoved,
  getChanged,
  DiffResult,
  Diffable,
  isDifferent,
  $different,
  $changed,
} from "../../../diff/index";
import { createFragment } from "../../../utils";
import { Class } from "../../constants";

const NBSP = "\u00A0";

const stringify = (value: Diffable) =>
  JSON.stringify(value, null, NBSP.repeat(4));

const renderArrayDiff = (diff: DiffResult[]) => {
  const containerEl = document.createElement("div");

  const diffEls = diff.map((item) => {
    const rowEl = document.createElement("div");

    if (isAdded(item)) {
      rowEl.classList.add(Class.ADDED);
      rowEl.innerText = stringify(getAdded(item));
    } else if (isRemoved(item)) {
      rowEl.classList.add(Class.REMOVED);
      rowEl.innerText = stringify(getRemoved(item));
    } else {
      rowEl.appendChild(renderDiff(item));
    }

    return rowEl;
  });

  containerEl.classList.add(Class.INDENTED);
  containerEl.appendChild(createFragment(...diffEls));

  return createFragment("[", containerEl, "]");
};

const renderObjectDiff = (diff: Record<typeof $different, Diffable>) => {
  const containerEl = document.createElement("div");
  containerEl.classList.add(Class.INDENTED);

  const entryEls = Object.entries<Diffable>(diff).map(([key, value]) => {
    const rowEl = document.createElement("div");
    const keyEl = document.createElement("span");
    const frag = createFragment(keyEl);

    if (isAdded(value)) {
      const valueEl = document.createElement("span");
      rowEl.classList.add(Class.ADDED);
      valueEl.innerText = stringify(getAdded(value));
      frag.appendChild(valueEl);
    } else if (isRemoved(value)) {
      const valueEl = document.createElement("span");
      rowEl.classList.add(Class.REMOVED);
      valueEl.innerText = stringify(getRemoved(value));
      frag.appendChild(valueEl);
    } else if (isChanged(value)) {
      frag.appendChild(renderDiff(value));
    }

    keyEl.innerText = `"${key}": `;
    rowEl.appendChild(frag);

    return rowEl;
  });

  containerEl.appendChild(createFragment(...entryEls));

  return createFragment("{", containerEl, "}");
};

const renderChanged = (diff: Record<typeof $changed, [Diffable, Diffable]>) => {
  const [prev, next] = getChanged(diff);
  const prevEl = document.createElement("span");
  const nextEl = document.createElement("span");

  prevEl.classList.add("prev");
  nextEl.classList.add("next");
  prevEl.innerText = stringify(prev);
  nextEl.innerText = stringify(next);

  const el = document.createElement("div");

  el.classList.add(Class.CHANGED);
  el.appendChild(createFragment(prevEl, nextEl));

  return el;
};

const renderDiff = (diff: DiffResult): HTMLElement | DocumentFragment => {
  if (isChanged(diff)) {
    return renderChanged(diff);
  } else if (isDifferent(diff)) {
    if (Array.isArray(diff)) return renderArrayDiff(diff);

    return renderObjectDiff(diff);
  } else {
    const el = document.createElement("span");

    el.classList.add(Class.UNCHANGED);
    el.innerText = stringify(diff);

    return el;
  }
};

export default renderDiff;
