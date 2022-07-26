export const createFragment = (
  ...els: Array<string | HTMLElement | DocumentFragment>
) => {
  const frag = document.createDocumentFragment();
  frag.append(...els);
  return frag;
};
