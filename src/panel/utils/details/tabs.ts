import { diff } from "../../../diff/index";
import { Entry } from "../../../types";
import { createElement } from "../../../utils";
import { Class } from "../../constants";
import { DetailsTab } from "./constants";
import renderDiff from "./diff";
import { DetailState } from "./types";

const renderTabs = (
  state: DetailState,
  { action, prevState, nextState }: Entry,
  updateContent: (content: Node) => void
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
    value: AnyRecord,
    content: Node
  ) => {
    if (tab === state.tab) return;

    clearTab();
    state.tab = tab;
    state.content = value;
    targetEl.classList.add(Class.ACTIVE);

    updateContent(content);
  };

  const renderTab = (
    tab: DetailsTab,
    value: AnyRecord,
    content: Node,
    active = false
  ) => {
    const el = createElement("button", {
      classes: [
        Class.TABS__TAB,
        Class.BORDERED,
        Class.INTERACTIVE,
        ...(active ? [Class.ACTIVE] : []),
      ],
      attributes: {
        "data-tab": tab,
      },
      listeners: {
        click: () => {
          setTab(el, tab, value, content);
        },
      },
      text: tab.toUpperCase(),
    });

    return el;
  };

  return createElement("nav", {
    classes: [Class.TABS],
    children: [
      renderTab(DetailsTab.ACTION, action, renderDiff(action), true),
      renderTab(
        DetailsTab.STATE,
        nextState,
        renderDiff(diff(prevState, nextState))
      ),
    ],
  });
};

export default renderTabs;
