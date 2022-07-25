import { Entry } from "../../../types";
import { Class } from "../../constants";

enum DetailsTab {
  ACTION = "action",
  STATE = "state",
}

const renderTabs = (
  state: { tab: DetailsTab },
  [action, actionState]: Entry,
  updateContent: (value: AnyRecord) => void
) => {
  const clearTab = () => {
    const el = document.querySelector(
      `.${Class.TABS__TAB}[data-tab="${state.tab}"]`
    );

    el?.classList.remove(Class.ACTIVE);
  };

  const setTab = (
    targetEl: HTMLElement,
    tab: DetailsTab,
    content: AnyRecord
  ) => {
    if (tab === state.tab) return;

    clearTab();
    state.tab = tab;
    targetEl.classList.add(Class.ACTIVE);
    updateContent(content);
  };

  const renderTab = (tab: DetailsTab, content: AnyRecord, active = false) => {
    const el = document.createElement("button");

    el.classList.add(Class.TABS__TAB);
    el.setAttribute("data-tab", tab);
    el.addEventListener("click", () => setTab(el, tab, content));
    el.innerText = tab;

    if (active) {
      el.classList.add(Class.ACTIVE);
    }

    return el;
  };

  const el = document.createElement("nav");

  el.classList.add(Class.TABS);
  el.append(
    renderTab(DetailsTab.ACTION, action, true),
    renderTab(DetailsTab.STATE, actionState)
  );

  return el;
};

export default renderTabs;
