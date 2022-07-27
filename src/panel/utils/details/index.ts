import { Entry } from "../../../types";
import { createElement, createFragment } from "../../../utils";
import { Class } from "../../constants";
import renderContent from "./content";
import renderTabs from "./tabs";
import client from "../../client";
import { logValue } from "../../../sdk";
import { DetailState } from "./types";

const detailsEl = document.querySelector(`.${Class.DETAILS}`);

export const clearDetails = () => {
  if (!detailsEl) return;

  detailsEl.replaceChildren();
};

export const renderDetails = (entry: Entry) => {
  if (!detailsEl) return;

  enum DetailsTab {
    ACTION = "action",
    STATE = "state",
  }

  const { action } = entry;
  const detailsState: DetailState = {
    tab: DetailsTab.ACTION,
    content: action,
  };

  const [contentEl, updateContent] = renderContent(action);
  const tabsEl = renderTabs(detailsState, entry, updateContent);

  const logEl = createElement("button", {
    classes: [Class.DETAILS__LOG],
    listeners: {
      click: () => {
        client.sendMessage(logValue({ value: detailsState.content }));
      },
    },
    text: "log",
  });

  detailsEl.appendChild(createFragment(tabsEl, contentEl, logEl));
};
