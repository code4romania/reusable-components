let insertAfter: ChildNode | null | false = null;
export default function styleInject(css: string): void {
  if (!css || typeof document === "undefined") {
    return;
  }

  const head = document.head || document.getElementsByTagName("head")[0];

  if (insertAfter == null) {
    insertAfter = false;
    const headNodes = head.childNodes;
    for (let i = 0; i < headNodes.length; i++) {
      const node = headNodes[i];
      if (node.nodeType === Node.COMMENT_NODE) {
        if (node.nodeValue?.trim() === "!code4ro-style-inject") {
          insertAfter = node;
          break;
        }
      }
    }
  }

  const style = document.createElement("style");
  style.type = "text/css";

  if (insertAfter) {
    const sibling = insertAfter.nextSibling;
    if (sibling) {
      insertAfter.parentNode?.insertBefore(style, sibling);
    } else {
      insertAfter.parentNode?.appendChild(style);
    }
    insertAfter = style;
  } else {
    head.appendChild(style);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((style as any).styleSheet) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (style as any).styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
