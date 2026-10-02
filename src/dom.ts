export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string | number,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className !== undefined && className !== "") {
    node.classList.add(...className.split(" "));
  }
  if (text !== undefined) {
    node.textContent = String(text);
  }
  return node;
}

export function replaceChildren(
  parent: HTMLElement,
  ...children: (HTMLElement | string)[]
): void {
  parent.replaceChildren(...children);
}
