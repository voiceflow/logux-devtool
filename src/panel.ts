import { PANEL_KEY } from "./constants";
import { addVersion, replaceVersions } from "./sdk";
import { Entry, Version } from "./types";

interface State {
  activeVersion: Version | null;
  activeEntry: number | null;
}

const state: State = {
  activeVersion: null,
  activeEntry: null,
};

const panelPort = chrome.runtime.connect({ name: PANEL_KEY });

const headerEl = document.querySelector(".header");
const timelineEl = document.querySelector(".timeline");
const detailsEl = document.querySelector(".details");

const clearDetails = () => {
  if (!detailsEl) return;

  detailsEl.textContent = "";
};

const renderDetails = ([, state]: Entry) => {
  if (!detailsEl) return;

  detailsEl.textContent = JSON.stringify(state, null, 2);
};

const clearActiveEntry = () => {
  if (state.activeEntry === null) return;

  const el = document.querySelector(
    `.timeline__entry:nth-of-type(${state.activeEntry + 1})`
  );

  clearDetails();
  el?.classList.remove("active");
  state.activeEntry = null;
};

const setActiveEntry = (targetEl: HTMLElement, entry: Entry) => {
  const index = state.activeVersion?.entries.indexOf(entry);
  if (index === undefined) return;

  clearActiveEntry();
  state.activeEntry = index;
  targetEl.classList.add("active");
  renderDetails(entry);
};

const renderEntry = (entry: Entry) => {
  const [action] = entry;
  const el = document.createElement("li");

  el.classList.add("timeline__entry");
  el.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveEntry(el, entry);
  });
  el.textContent = JSON.stringify(action);

  return el;
};

const clearActiveVersion = () => {
  if (!state.activeVersion) return null;

  const el = document.querySelector(
    `.header > .version[data-id="${state.activeVersion.id}"]`
  );

  clearActiveEntry();
  el?.classList.remove("active");
  state.activeVersion = null;
};

const setActiveVersion = (targetEl: HTMLElement, version: Version) => {
  clearActiveVersion();
  state.activeVersion = version;
  targetEl.classList.add("active");
  timelineEl?.replaceChildren(...version.entries.map(renderEntry));
};

const renderVersion = (version: Version) => {
  const el = document.createElement("a");

  el.classList.add("version");
  el.setAttribute("href", `?versionID=${version.id}`);
  el.setAttribute("data-id", version.id);
  el.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    setActiveVersion(el, version);
  });
  el.textContent = version.id;

  return el;
};

panelPort.onMessage.addListener((action: AnyAction) => {
  console.log("panel received", action);
  if (addVersion.match(action)) {
    headerEl?.appendChild(renderVersion(action.payload));
  } else if (replaceVersions.match(action)) {
    headerEl?.append(...action.payload.map(renderVersion));
  }
});
