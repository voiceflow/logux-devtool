import { diff } from "../../../diff/index";
import { Class } from "../../constants";
import renderDiff from "./diff";
// import * as Diff2HTML from "https://unpkg.com/diff2html@3.4.18/lib-esm/diff2html.js";
// import * as Diff from "https://unpkg.com/diff@5.1.0/lib/index.es6.js";

const NBSP = "\u00A0";

const renderContent = (initialValue: AnyRecord) => {
  const el = document.createElement("main");

  const updateContent = (value: AnyRecord) => {
    const result = diff({ foo: "bar", payload: "fake" }, value);
    const content = renderDiff(result);

    console.log(result);

    // const diff = Diff.diffJson({ old: "fake" }, value);

    // const diffEls = diff.map((part) => {
    //   const color = part.added ? "green" : part.removed ? "red" : "grey";
    //   const span = document.createElement("span");

    //   span.style.color = color;
    //   span.innerText = part.value;

    //   return span;
    // });

    // el.append(...diffEls);
    el.replaceChildren(content);
    // el.innerText = JSON.stringify(value, null, NBSP.repeat(4));
  };

  el.classList.add(Class.TABS__CONTENT);
  updateContent(initialValue);

  return [el, updateContent] as const;
};

export default renderContent;
