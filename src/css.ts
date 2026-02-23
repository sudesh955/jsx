const hyphenateRegex = /[A-Z]|^ms/g;

const styleNames = new Map<string, string>();

function processStyleName(name: string): string {
  if (name.charCodeAt(1) === 45) {
    return name;
  }
  let out = styleNames.get(name);
  if (!out) {
    out = name.replace(hyphenateRegex, "-$&").toLowerCase();
    styleNames.set(name, out);
  }
  return out;
}

export function stringifyStyle(style: object | string, parts: string[]) {
  parts.push(` style="`);
  if (typeof style === "string") {
    parts.push(style);
  } else {
    const css: { [key: string]: string } = style as any;
    for (const key in css) {
      parts.push(processStyleName(key), ":", css[key]);
    }
  }
  parts.push(`"`);
}
