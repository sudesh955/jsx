import { describe, expect, test } from "bun:test";

import { render } from "./render";

describe("render", () => {
  test("null", async () => {
    expect(await render(null)).toBe("");
  });
  test("boolean", async () => {
    expect(await render(true)).toBe("");
    expect(await render(false)).toBe("");
  });
  test("number", async () => {
    expect(await render(0)).toBe("0");
    expect(await render(1000)).toBe("1000");
  });
  test("string", async () => {
    expect(await render("")).toBe("");
    expect(await render("hello world")).toBe("hello world");
  });
  test("array", async () => {
    expect(await render([1, 2, 3])).toBe("123");
  });
  test("fragment", async () => {
    expect(await render(<></>)).toBe("");
    expect(await render(<>123</>)).toBe("123");
  });
  describe("element", () => {
    test("image", async () => {
      expect(await render(<img src="test.png" />)).toBe(
        `<img src="test.png"/>`,
      );
    });
    test("escape", async () => {
      expect(await render(<div>"abc"</div>)).toBe(`<div>&quot;abc&quot;</div>`);
    });
    test("safe", async () => {
      expect(await render(<div safe={`"abc"`} />)).toBe(`<div>"abc"</div>`);
    });
  });
  describe("function", () => {
    function Test() {
      return "Hello World";
    }
    test("01", async () => {
      expect(await render(<Test />)).toBe("Hello World");
    });
    test("02", async () => {
      async function TestAsync() {
        return "Hello World";
      }
      expect(await render(<TestAsync />)).toBe("Hello World");
    });
    test("03", async () => {
      expect(
        await render(
          <div>
            Test
            <Test />
          </div>,
        ),
      ).toBe("<div>TestHello World</div>");
    });
    test("03", async () => {
      class Context {}
      const ctx = new Context();
      function Test(props: { name: string }, _ctx: Context) {
        expect(ctx).toBe(_ctx);
        return "Hello " + props.name;
      }
      expect(await render(<Test name="World" />, ctx)).toBe("Hello World");
    });
  });
});
