import { createElement } from "../../../utils";
import { Class } from "../../constants";
import renderDiff from "./diff";

const renderContent = (initialValue: AnyRecord) => {
  const el = createElement("main", { classes: [Class.TABS__CONTENT] });

  const updateContent = (content: Node) => el.replaceChildren(content);

  updateContent(renderDiff(initialValue));

  return [el, updateContent] as const;
};

export default renderContent;
