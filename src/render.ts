import { escapeHTML } from "bun";
import { Fragment, KiteNode } from "./jsx";
import { stringifyStyle } from "./css";

const escape = escapeHTML;

type RenderElement<
  P = unknown,
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> =
  | {
      props: P;
      type: (props: P, ctx: Kite.Context | null) => KiteNode;
    }
  | {
      type: typeof Fragment;
      props: { children?: KiteNode };
    }
  | { type: keyof JSX.IntrinsicElements; props: JSX.IntrinsicElements[Tag] };

function renderNode(
  el: KiteNode,
  parts: string[],
  ctx: Kite.Context | null,
): unknown | Promise<unknown> {
  if (typeof el === "string") return parts.push(escape(el));
  if (typeof el === "number") return parts.push(el.toString());
  if (el === true || !el) return;
  if (Array.isArray(el)) {
    const length = el.length;
    for (let i = 0; i < length; i++) {
      renderNode(el[i], parts, ctx);
    }
    return;
  }
  const ke = el as unknown as RenderElement;
  if (ke.type === Fragment) {
    if (ke.props.children) renderNode(ke.props.children, parts, ctx);
    return;
  }
  if (typeof ke.type === "string") return renderHtml(ke, parts, ctx);
  if (typeof ke.type === "function") {
    const it = ke.type(el.props, ctx);
    if (it instanceof Promise)
      return it.then((it) => renderNode(it, parts, ctx));
    return renderNode(it, parts, ctx);
  }
  throw new Error("unknown type of element");
}

function renderHtml<K extends keyof JSX.IntrinsicElements = string>(
  el: { type: K; props: JSX.IntrinsicElements[K] },
  parts: string[],
  ctx: Kite.Context | null,
): unknown | Promise<unknown> {
  if (typeof el.type !== "string") throw new Error();
  const props = el.props;
  parts.push("<", el.type);
  propsToString(props, parts);
  if (isVoidElement[el.type]) return parts.push("/>");
  parts.push(">");
  if (typeof props.safe === "string") {
    if (typeof props.children !== "undefined") {
      throw new Error("can not use children with safe");
    }
    parts.push(props.safe);
  } else {
    const children = props.children;
    if (typeof children !== "undefined") renderNode(children, parts, ctx);
  }
  parts.push("</", el.type, ">");
}

function propsToString(props: JSX.HtmlTag, parts: string[]) {
  const keys = Object.keys(props);
  const values = props as { [key: string]: unknown };
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    const key = keys[i];
    if (key === "children" || key === "safe") continue;
    const value = values[key];
    if (!value) continue;
    if (key === "style") {
      stringifyStyle(value, parts);
      continue;
    }
    if (typeof value === "boolean") {
      parts.push(" ", escape(key));
      continue;
    }
    if (typeof value === "string") {
      parts.push(" ", escape(key), `="`, escape(value), `"`);
    } else {
      parts.push(" ", escape(key), `="`, escape(value.toString()), `"`);
    }
  }
}

export async function render(el: KiteNode, ctx: null | Kite.Context = null) {
  const parts: string[] = [];
  await renderNode(el, parts, ctx);
  return parts.join("");
}

const isVoidElement: { [key: string]: true | undefined } = {
  meta: true,
  link: true,
  img: true,
  br: true,
  input: true,
  hr: true,
  area: true,
  base: true,
  col: true,
  command: true,
  embed: true,
  keygen: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};
