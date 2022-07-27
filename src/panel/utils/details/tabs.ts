import { diff } from "../../../diff/index";
import { Entry } from "../../../types";
import { createElement } from "../../../utils";
import { Class } from "../../constants";
import { DetailsTab } from "./constants";
import renderDiff, { stringify } from "./diff";

const renderTabs = (
  state: { tab: DetailsTab },
  [action, prevState, nextState]: Entry,
  updateContent: (content: Node) => void
) => {
  const clearTab = () => {
    const el = document.querySelector(
      `.${Class.TABS__TAB}[data-tab="${state.tab}"]`
    );

    el?.classList.remove(Class.ACTIVE);
  };

  const setTab = (targetEl: HTMLElement, tab: DetailsTab, content: Node) => {
    if (tab === state.tab) return;

    clearTab();
    state.tab = tab;
    targetEl.classList.add(Class.ACTIVE);

    updateContent(content);
  };

  const renderTab = (tab: DetailsTab, content: Node, active = false) => {
    const el = createElement("button", {
      classes: [Class.TABS__TAB, ...(active ? [Class.ACTIVE] : [])],
      attributes: {
        "data-tab": tab,
      },
      listeners: {
        click: () => {
          setTab(el, tab, content);
        },
      },
      text: tab,
    });

    return el;
  };

  return createElement("nav", {
    classes: [Class.TABS],
    children: [
      renderTab(
        DetailsTab.ACTION,
        document.createTextNode(stringify(action)),
        true
      ),
      renderTab(DetailsTab.STATE, renderDiff(diff(prevState, nextState))),
    ],
  });
};

export default renderTabs;
