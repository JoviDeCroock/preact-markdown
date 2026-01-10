# preact-markdown

A lightweight markdown renderer for Preact applications built on the powerful [unified](https://unifiedjs.com/) ecosystem (remark/rehype).

## Features

- ✨ **Simple API** - Easy to use component with sensible defaults
- 🔌 **Plugin Support** - Full access to remark and rehype plugins
- 🛡️ **Secure by Default** - Built-in HTML sanitization to prevent XSS
- 🎨 **Flexible** - Customize wrapper element and styling
- 📦 **Lightweight** - Minimal bundle size
- ⚡ **Fast** - Powered by unified's highly optimized parser

## Installation

```bash
pnpm add preact-markdown
```

Or with npm:

```bash
npm install preact-markdown
```

## Basic Usage

```tsx
import { Markdown } from 'preact-markdown';

function App() {
  return (
    <Markdown>
      # Hello World

      This is **markdown** content!

      - Easy to use
      - Supports all markdown features
      - Built on remark/rehype
    </Markdown>
  );
}
```

## Usage with Plugins

The real power of `preact-markdown` comes from the remark/rehype plugin ecosystem:

### GitHub Flavored Markdown

```tsx
import { Markdown } from 'preact-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  return (
    <Markdown remarkPlugins={[remarkGfm]}>
      ## Tables

      | Feature | Supported |
      |---------|-----------|
      | Tables  | ✅        |
      | ~~Strike~~ | ✅        |

      - [x] Task lists
      - [ ] More features
    </Markdown>
  );
}
```

### Syntax Highlighting

```tsx
import { Markdown } from 'preact-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

function App() {
  return (
    <Markdown rehypePlugins={[rehypeHighlight]}>
      {\`\`\`typescript
      function greet(name: string) {
        console.log(\`Hello, \${name}!\`);
      }
      \`\`\`}
    </Markdown>
  );
}
```

### Multiple Plugins

```tsx
import { Markdown } from 'preact-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

function App() {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      Your markdown with $\\LaTeX$ math and code highlighting!
    </Markdown>
  );
}
```

## API

### Props

```typescript
interface MarkdownProps {
  /** The markdown content to render */
  children: string;

  /** Custom tag name for the wrapper element (default: 'div') */
  wrapper?: string;

  /** Additional class name for the wrapper */
  className?: string;

  /** Whether to sanitize HTML (recommended for user-generated content) */
  sanitize?: boolean | Schema;

  /** Remark plugins to use for markdown processing */
  remarkPlugins?: Plugin[];

  /** Rehype plugins to use for HTML processing */
  rehypePlugins?: Plugin[];

  /** Additional remark-rehype options */
  remarkRehypeOptions?: Record<string, any>;
}
```

### Options

- **`wrapper`**: Change the wrapper element (default: `'div'`)
- **`className`**: Add CSS classes to the wrapper
- **`sanitize`**: Enable/disable HTML sanitization (default: `true`)
  - Pass `false` to disable (not recommended for user content)
  - Pass a custom schema object for fine-grained control
- **`remarkPlugins`**: Array of remark plugins to transform markdown
- **`rehypePlugins`**: Array of rehype plugins to transform HTML
- **`remarkRehypeOptions`**: Additional options for the markdown-to-HTML conversion

## Popular Plugins

### Remark Plugins (Markdown Processing)

- [`remark-gfm`](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown support
- [`remark-math`](https://github.com/remarkjs/remark-math) - Math equation support
- [`remark-emoji`](https://github.com/remarkjs/remark-emoji) - Emoji shortcodes
- [`remark-toc`](https://github.com/remarkjs/remark-toc) - Table of contents generation

### Rehype Plugins (HTML Processing)

- [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight) - Syntax highlighting with highlight.js
- [`rehype-prism`](https://github.com/mapbox/rehype-prism) - Syntax highlighting with Prism
- [`rehype-slug`](https://github.com/rehypejs/rehype-slug) - Add IDs to headings
- [`rehype-autolink-headings`](https://github.com/rehypejs/rehype-autolink-headings) - Add links to headings
- [`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize) - Sanitize HTML (included by default)

## Security

By default, `preact-markdown` sanitizes HTML content using [`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize) to prevent XSS attacks. This is especially important when rendering user-generated content.

To disable sanitization (not recommended):

```tsx
<Markdown sanitize={false}>
  Your markdown here
</Markdown>
```

For custom sanitization rules:

```tsx
import { defaultSchema } from 'rehype-sanitize';

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'custom-element'],
};

<Markdown sanitize={customSchema}>
  Your markdown here
</Markdown>
```

## Examples

Check out the [example folder](./example) for a complete working demo with:

- Basic markdown rendering
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Syntax highlighting
- Combined features

To run the examples:

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173 in your browser.

## Comparison with react-markdown

`preact-markdown` is inspired by [`react-markdown`](https://github.com/remarkjs/react-markdown) but designed specifically for Preact:

| Feature | preact-markdown | react-markdown |
|---------|----------------|----------------|
| Framework | Preact | React |
| Plugin System | ✅ remark/rehype | ✅ remark/rehype |
| Sanitization | ✅ Default enabled | ✅ Default enabled |
| Bundle Size | Smaller | Larger |

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Run tests
pnpm test

# Run examples
pnpm dev

# Lint code
pnpm lint

# Format code
pnpm format
```

## License

MIT © [Jovi De Croock](https://github.com/JoviDeCroock)

## Credits

Built with:

- [unified](https://unifiedjs.com/) - Interface for processing text with syntax trees
- [remark](https://github.com/remarkjs/remark) - Markdown processor
- [rehype](https://github.com/rehypejs/rehype) - HTML processor
- [Preact](https://preactjs.com/) - Fast 3kB alternative to React

Inspired by [react-markdown](https://github.com/remarkjs/react-markdown).
