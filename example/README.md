# Preact Markdown Examples

This folder contains examples demonstrating the usage of `preact-markdown`.

## Running the Examples

From the root of the project:

```bash
# Install dependencies (if not already done)
pnpm install

# Start the development server
cd example
pnpm dev
```

Then open your browser to the URL shown in the terminal (typically http://localhost:5173).

## Examples Included

1. **Basic Markdown** - Standard markdown features (headers, lists, links, code, blockquotes)
2. **GitHub Flavored Markdown** - Tables, task lists, strikethrough using `remark-gfm`
3. **Syntax Highlighting** - Code blocks with syntax highlighting using `rehype-highlight`
4. **Combined Features** - All features working together

## Adding Your Own Plugins

The remark/rehype ecosystem has many plugins available:

### Popular Remark Plugins
- `remark-gfm` - GitHub Flavored Markdown support
- `remark-math` - Math equation support
- `remark-emoji` - Emoji support
- `remark-toc` - Table of contents generation

### Popular Rehype Plugins
- `rehype-highlight` - Syntax highlighting
- `rehype-sanitize` - HTML sanitization (included by default)
- `rehype-slug` - Add IDs to headings
- `rehype-autolink-headings` - Add links to headings

## Example Usage with Custom Plugins

```tsx
import { Markdown } from 'preact-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

function App() {
  return (
    <Markdown 
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      Your markdown content with $\\LaTeX$ math support!
    </Markdown>
  );
}
```
