import { Class } from "../../constants";

const NBSP = "\u00A0";

const renderContent = (initialValue: AnyRecord) => {
  const el = document.createElement("main");

  const updateContent = (value: AnyRecord) => {
    el.innerText = JSON.stringify(value, null, NBSP.repeat(4));
  };

  el.classList.add(Class.TABS__CONTENT);
  updateContent(initialValue);

  return [el, updateContent] as const;
};

export default renderContent;
