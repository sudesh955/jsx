export const Fragment = Symbol("fragment");

const $$typeof = Symbol("");

export type KiteKey = string | number | bigint;

export type KiteFC<P> = (
  props: P,
  ctx: Kite.Context,
) => KiteNode | Promise<KiteNode>;

export type KiteElementType<
  P = unknown,
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> =
  | string
  | KiteFC<P>
  | typeof Fragment
  | { [K in Tag]: P extends JSX.IntrinsicElements[K] ? K : never }[Tag];

export type KiteElement<
  P = unknown,
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> = {
  props: P;
  $$typeof: symbol;
  key: string | null;
  type: KiteElementType<P, Tag>;
};

export type KiteNode =
  | null
  | boolean
  | number
  | string
  | KiteElement
  | KiteNode[];

export function jsxDEV(
  type: KiteElementType,
  props: unknown,
  key: undefined | KiteKey,
): KiteElement {
  return {
    type,
    props,
    $$typeof,
    key: buildKey(key),
  };
}

export function jsx(
  type: KiteElementType,
  props: unknown,
  key: undefined | KiteKey,
): KiteElement {
  return {
    type,
    props,
    $$typeof,
    key: buildKey(key),
  };
}

export function jsxs(
  type: KiteElementType,
  props: unknown,
  key: undefined | KiteKey,
): KiteElement {
  return {
    type,
    props,
    $$typeof,
    key: buildKey(key),
  };
}

function buildKey(key: KiteKey | undefined): null | string {
  if (key === undefined) return null;
  if (typeof key === "string") return key;
  return key.toString();
}

declare global {
  namespace Kite {
    interface Context {}
  }

  namespace JSX {
    type Element = KiteElement;
    type ElementType = keyof IntrinsicElements | KiteFC<any>;

    interface IntrinsicElements {
      [tag: string]: HtmlTag;
    }

    interface IntrinsicAttributes {
      children?: KiteNode;
    }
  }
}
