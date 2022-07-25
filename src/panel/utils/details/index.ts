import { Entry } from "../../../types";
import { Class } from "../../constants";
import renderContent from "./content";
import renderTabs from "./tabs";

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

  const [action] = entry;
  const detailsState: { tab: DetailsTab } = { tab: DetailsTab.ACTION };

  const [contentEl, updateContent] = renderContent(action);
  const tabsEl = renderTabs(detailsState, entry, updateContent);

  detailsEl.append(tabsEl, contentEl);
};
