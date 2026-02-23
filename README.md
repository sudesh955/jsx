# @vimpak/jsx

A JSX library for server-side rendering, designed to work with Bun.

## Installation

```bash
npm install @vimpak/jsx
```

## Usage

### JSX Configuration

Configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@vimpak/jsx"
  }
}
```

### Basic Example

```tsx
import { render } from "@vimpak/jsx";

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

const html = await render(<Greeting name="World" />);
// Output: <h1>Hello, World!</h1>
```

### Fragments

```tsx
function Page() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}
```

### Safe HTML

Use the `safe` prop to render raw HTML:

```tsx
function Component() {
  return <div safe="<strong>Bold text</strong>" />;
}
```

### Styles

```tsx
function Styled() {
  return <div style={{ color: "red", fontSize: "16px" }}>Styled</div>;
}
```

### Context

```tsx
class AppContext {
  async getTheme() {
    return "dark";
  }
}

const ctx = new AppContext();

function Greeting(props: { name: string }, ctx: AppContext) {
  return <div></div>;
}

function App() {
  return (
    <div>
      <Greeting />
    </div>
  );
}

const html = await render(<App />, ctx);
```

## API

### `render(element, context?)`

Renders a JSX element to an HTML string.

- **element**: The root JSX element to render
- **context** (optional): A `Context` value for passing values to all components

Returns `Promise<string>`.
