import { Entry, Version } from "../../types";
import state from "../state";
import { Class } from "../constants";
import { renderDetails, clearDetails } from "./details/index";

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
  const el = document.createElement("li");

  el.classList.add(Class.TIMELINE__ENTRY);
  el.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveEntry(el, entry);
  });
  el.innerText = action.type;

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
  timelineEl?.replaceChildren(...version.entries.map(renderEntry));
};

const renderVersion = (version: Version) => {
  const el = document.createElement("a");

  el.classList.add(Class.VERSION);
  el.setAttribute("href", `?versionID=${version.id}`);
  el.setAttribute("data-id", version.id);
  el.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    setActiveVersion(el, version);
  });
  el.innerText = version.label;

  return el;
};

export const appendVersions = (...versions: Version[]) =>
  headerEl?.append(...versions.map(renderVersion));
