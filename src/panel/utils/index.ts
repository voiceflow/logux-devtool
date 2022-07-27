import { Entry, Version } from "../../types";
import state from "../state";
import { Class } from "../constants";
import { renderDetails, clearDetails } from "./details/index";
import { createElement, createFragment } from "../../utils";

const headerEl = document.querySelector(`.${Class.HEADER}`);
const timelineEl = document.querySelector(`.${Class.TIMELINE}`);

const clearActiveEntry = () => {
  if (state.activeEntry === null) return;

  const el = document.querySelector(
    `.${Class.TIMELINE__ENTRY}:nth-of-type(${state.activeEntry + 1})`
  );

  clearDetails();
  el?.classList.remove(Class.ACTIVE);
  state.activeEntry = null;
};

const setActiveEntry = (targetEl: HTMLElement, entry: Entry) => {
  const index = state.activeVersion?.entries.indexOf(entry);
  if (index === undefined) return;

  clearActiveEntry();
  state.activeEntry = index;
  targetEl.classList.add(Class.ACTIVE);
  renderDetails(entry);
};

const renderEntry = (entry: Entry) => {
  const [action] = entry;
  const el = createElement("li", {
    classes: [Class.TIMELINE__ENTRY, Class.BORDERED, Class.INTERACTIVE],
    listeners: {
      click: (e) => {
        e.preventDefault();
        setActiveEntry(el, entry);
      },
    },
    text: action.type,
  });

  return el;
};

const clearActiveVersion = () => {
  if (!state.activeVersion) return null;

  const el = document.querySelector(
    `.${Class.HEADER} > .${Class.VERSION}[data-id="${state.activeVersion.id}"]`
  );

  clearActiveEntry();
  el?.classList.remove(Class.ACTIVE);
  state.activeVersion = null;
};

const setActiveVersion = (targetEl: HTMLElement, version: Version) => {
  clearActiveVersion();
  state.activeVersion = version;
  targetEl.classList.add(Class.ACTIVE);

  if (!timelineEl) return;

  const entryListEl = createElement("div", {
    classes: [Class.TIMELINE__ENTRY_LIST],
    children: version.entries.map(renderEntry),
  });

  timelineEl.replaceChildren(
    createElement("button", {
      classes: [Class.TIMELINE__CLEAR, Class.BORDERED, Class.INTERACTIVE],
      text: "CLEAR",
      listeners: {
        click: () => entryListEl.replaceChildren(),
      },
    }),
    entryListEl
  );
  timelineEl.scrollTop = timelineEl.scrollHeight;
};

const renderVersion = (version: Version) => {
  const el = createElement("a", {
    classes: [Class.VERSION],
    attributes: {
      href: `?versionID=${version.id}`,
      "data-id": version.id,
    },
    listeners: {
      click: (e) => {
        if (e.ctrlKey || e.metaKey) return;

        e.preventDefault();
        setActiveVersion(el, version);
      },
    },
    text: version.label,
  });

  return el;
};

export const appendVersions = (...versions: Version[]) => {
  versions.forEach((version) => (state.versions[version.id] = version));

  headerEl?.appendChild(createFragment(...versions.map(renderVersion)));
};

export const appendEntry = (versionID: string, entry: Entry) => {
  const version = state.versions[versionID];
  if (version) {
    version.entries.push(entry);
  }

  if (state.activeVersion?.id !== versionID) return;

  const entryEl = renderEntry(entry);
  entryEl.classList.add(Class.NEW);
  entryEl.addEventListener("mouseleave", () =>
    entryEl.classList.remove(Class.NEW)
  );

  timelineEl?.appendChild(entryEl);

  entryEl.scrollIntoView();
};
