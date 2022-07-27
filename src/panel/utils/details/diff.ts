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
import { createElement, createFragment } from "../../../utils";
import { Class } from "../../constants";

const NBSP = "\u00A0";

const stringify = (value: Diffable) =>
  JSON.stringify(value, null, NBSP.repeat(4));

const renderArrayDiff = (diff: DiffResult[]) => {
  const diffEls = diff.map((item) => {
    const rowEl = createElement("div");

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

  const containerEl = createElement("div", {
    classes: [Class.INDENTED],
    children: diffEls,
  });

  return createFragment("[", containerEl, "]");
};

const renderObjectDiff = (diff: Record<typeof $different, Diffable>) => {
  const containerEl = createElement("div", { classes: [Class.INDENTED] });

  const entryEls = Object.entries<Diffable>(diff).map(([key, value]) => {
    const keyEl = createElement("span", { text: `"${key}": ` });
    const frag = createFragment(keyEl);
    const rowEl = createElement("div", { children: [frag] });

    if (isAdded(value)) {
      rowEl.classList.add(Class.ADDED);
      frag.appendChild(
        createElement("span", {
          text: stringify(getAdded(value)),
        })
      );
    } else if (isRemoved(value)) {
      rowEl.classList.add(Class.REMOVED);
      frag.appendChild(
        createElement("span", {
          text: stringify(getRemoved(value)),
        })
      );
    } else if (isChanged(value)) {
      frag.appendChild(renderDiff(value));
    }

    return rowEl;
  });

  containerEl.appendChild(createFragment(...entryEls));

  return createFragment("{", containerEl, "}");
};

const renderChanged = (diff: Record<typeof $changed, [Diffable, Diffable]>) => {
  const [prev, next] = getChanged(diff);
  const prevEl = createElement("span", {
    classes: [Class.PREV],
    text: stringify(prev),
  });
  const nextEl = createElement("span", {
    classes: [Class.NEXT],
    text: stringify(next),
  });

  return createElement("div", {
    classes: [Class.CHANGED],
    children: [prevEl, " ", nextEl],
  });
};

const renderDiff = (diff: DiffResult): HTMLElement | DocumentFragment => {
  if (isChanged(diff)) {
    return renderChanged(diff);
  } else if (isDifferent(diff)) {
    if (Array.isArray(diff)) return renderArrayDiff(diff);

    return renderObjectDiff(diff);
  } else {
    return createElement("span", {
      classes: [Class.UNCHANGED],
      text: stringify(diff),
    });
  }
};

export default renderDiff;
