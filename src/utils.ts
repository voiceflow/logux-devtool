export const createFragment = (...children: Array<string | Node>) => {
  const frag = document.createDocumentFragment();
  frag.append(...children);
  return frag;
};

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  key: K,
  {
    text = "",
    children = [],
    classes = [],
    attributes = {},
    listeners = {},
  }: {
    text?: string;
    children?: Array<string | Node>;
    classes?: string[];
    attributes?: Record<string, string>;
    listeners?: Partial<{
      [K in keyof HTMLElementEventMap]: (event: HTMLElementEventMap[K]) => void;
    }>;
  } = {}
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(key);

  if (children.length) {
    el.appendChild(createFragment(...children));
  } else if (text) {
    el.innerText = text;
  }

  classes.forEach((className) => el.classList.add(className));

  Object.entries(attributes).forEach(([key, value]) =>
    el.setAttribute(key, value)
  );

  Object.entries(listeners).forEach(([key, value]) => {
    el.addEventListener(key, value as (event: Event) => void);
  });

  return el;
};
