import { render } from 'preact';
import { Markdown } from '../src/index';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function App() {
	return (
		<div class="examples">
			{/* Basic Example */}
			<div class="example">
				<div class="example-header">Basic Markdown</div>
				<div class="example-content">
					<Markdown className="markdown-content">
						{`# Welcome to Preact Markdown

This is a **bold statement** and this is *italic text*.

Here's a paragraph with \`inline code\` and a [link to Preact](https://preactjs.com).

## Features

- Easy to use
- Supports standard markdown
- Built on remark/rehype
- Extensible with plugins

### Code Example

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

> This is a blockquote demonstrating how quotes are rendered.`}
					</Markdown>
				</div>
			</div>

			{/* GitHub Flavored Markdown */}
			<div class="example">
				<div class="example-header">GitHub Flavored Markdown (with remark-gfm)</div>
				<div class="example-content">
					<Markdown
						className="markdown-content"
						remarkPlugins={[remarkGfm]}
					>
						{`## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Tables | ✅ | Via remark-gfm |
| Strikethrough | ✅ | ~~Like this~~ |
| Task lists | ✅ | See below |
| Autolinks | ✅ | www.example.com |

## Task Lists

- [x] Setup project
- [x] Add remark/rehype
- [ ] Write documentation
- [ ] Add tests

## Strikethrough

You can ~~cross out~~ text using double tildes.

## Autolinks

Check out www.preactjs.com or https://github.com/preactjs/preact`}
					</Markdown>
				</div>
			</div>

			{/* Syntax Highlighting */}
			<div class="example">
				<div class="example-header">Syntax Highlighting (with rehype-highlight)</div>
				<div class="example-content">
					<Markdown
						className="markdown-content"
						rehypePlugins={[rehypeHighlight]}
					>
						{`## TypeScript Example

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = { name: 'Alice', age: 30 };
console.log(greet(user));
\`\`\`

## Python Example

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(fibonacci(i))
\`\`\`

## JSX Example

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\``}
					</Markdown>
				</div>
			</div>

			{/* Combined Plugins */}
			<div class="example">
				<div class="example-header">All Features Combined</div>
				<div class="example-content">
					<Markdown
						className="markdown-content"
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeHighlight]}
					>
						{`# Complete Feature Showcase

## Installation

\`\`\`bash
pnpm add preact-markdown unified remark-parse remark-rehype rehype-stringify rehype-sanitize
\`\`\`

## Usage

\`\`\`tsx
import { Markdown } from 'preact-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function App() {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      # Your markdown here
    </Markdown>
  );
}
\`\`\`

## Feature Comparison

| Feature | preact-md | react-markdown |
|---------|----------------|----------------|
| Plugin System | ✅ | ✅ |
| Are really cool | ✅ | ✅ |

## Important Notes

> **Security**: By default, HTML is sanitized using \`rehype-sanitize\` to prevent XSS attacks.

---

For more information, visit the [GitHub repository](https://github.com/JoviDeCroock/preact-markdown).`}
					</Markdown>
				</div>
			</div>
		</div>
	);
}

render(<App />, document.getElementById('app')!);
