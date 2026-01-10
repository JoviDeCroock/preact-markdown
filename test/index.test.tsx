import { describe, it, expect } from 'vitest';
import { render } from 'preact';
import { Markdown } from '../src/index';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

describe('Markdown', () => {
	describe('Basic Rendering', () => {
		it('renders simple text', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown>Hello World</Markdown>, container);
			expect(container.textContent).toContain('Hello World');
		});

		it('renders headers', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`# Heading 1
## Heading 2
### Heading 3`}
				</Markdown>,
				container
			);

			expect(container.querySelector('h1')).toBeTruthy();
			expect(container.querySelector('h2')).toBeTruthy();
			expect(container.querySelector('h3')).toBeTruthy();
			expect(container.querySelector('h1')?.textContent).toBe('Heading 1');
		});

		it('renders bold and italic text', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					This is **bold** and this is *italic*.
				</Markdown>,
				container
			);

			expect(container.querySelector('strong')).toBeTruthy();
			expect(container.querySelector('em')).toBeTruthy();
			expect(container.querySelector('strong')?.textContent).toBe('bold');
			expect(container.querySelector('em')?.textContent).toBe('italic');
		});

		it('renders links', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown>[Preact](https://preactjs.com)</Markdown>, container);

			const link = container.querySelector('a');
			expect(link).toBeTruthy();
			expect(link?.getAttribute('href')).toBe('https://preactjs.com');
			expect(link?.textContent).toBe('Preact');
		});

		it('renders code blocks', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`\`\`\`javascript
const x = 42;
\`\`\``}
				</Markdown>,
				container
			);

			expect(container.querySelector('pre')).toBeTruthy();
			expect(container.querySelector('code')).toBeTruthy();
			expect(container.textContent).toContain('const x = 42;');
		});

		it('renders inline code', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>This is `inline code` here.</Markdown>,
				container
			);

			const code = container.querySelector('code');
			expect(code).toBeTruthy();
			expect(code?.textContent).toBe('inline code');
		});

		it('renders lists', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`- Item 1
- Item 2
- Item 3`}
				</Markdown>,
				container
			);

			expect(container.querySelector('ul')).toBeTruthy();
			const items = container.querySelectorAll('li');
			expect(items.length).toBe(3);
			expect(items[0].textContent).toBe('Item 1');
		});

		it('renders blockquotes', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>{'> This is a quote'}</Markdown>,
				container
			);

			const blockquote = container.querySelector('blockquote');
			expect(blockquote).toBeTruthy();
			expect(blockquote?.textContent).toContain('This is a quote');
		});
	});

	describe('Options', () => {
		it('applies custom className', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown className="custom-class">Hello</Markdown>,
				container
			);

			expect(container.querySelector('.custom-class')).toBeTruthy();
		});

		it('uses custom wrapper element', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown wrapper="section">Hello</Markdown>,
				container
			);

			expect(container.querySelector('section')).toBeTruthy();
		});

		it('uses default div wrapper', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown>Hello</Markdown>, container);

			const wrapper = container.firstElementChild;
			expect(wrapper?.tagName).toBe('DIV');
		});
	});

	describe('Sanitization', () => {
		it('sanitizes HTML by default', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{'<script>alert("xss")</script>Hello'}
				</Markdown>,
				container
			);

			expect(container.querySelector('script')).toBeFalsy();
		});

		it('sanitizes onclick handlers', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{'<a onclick="alert()">Click</a>'}
				</Markdown>,
				container
			);

			const link = container.querySelector('a');
			expect(link?.getAttribute('onclick')).toBeFalsy();
		});
	});

	describe('Remark Plugins', () => {
		it('supports remark-gfm for tables', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown remarkPlugins={[remarkGfm]}>
					{`| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`}
				</Markdown>,
				container
			);

			expect(container.querySelector('table')).toBeTruthy();
			expect(container.querySelector('th')).toBeTruthy();
			expect(container.querySelector('td')).toBeTruthy();
		});

		it('supports remark-gfm for strikethrough', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown remarkPlugins={[remarkGfm]}>
					{'This is ~~strikethrough~~ text'}
				</Markdown>,
				container
			);

			expect(container.querySelector('del')).toBeTruthy();
			expect(container.querySelector('del')?.textContent).toBe('strikethrough');
		});

		it('supports remark-gfm for task lists', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown remarkPlugins={[remarkGfm]}>
					{`- [x] Done
- [ ] Not done`}
				</Markdown>,
				container
			);

			const checkboxes = container.querySelectorAll('input[type="checkbox"]');
			expect(checkboxes.length).toBe(2);
			expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
			expect((checkboxes[1] as HTMLInputElement).checked).toBe(false);
		});
	});

	describe('Rehype Plugins', () => {
		it('supports rehype-highlight for syntax highlighting', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown rehypePlugins={[rehypeHighlight]}>
					{`\`\`\`javascript
const x = 42;
\`\`\``}
				</Markdown>,
				container
			);

			const code = container.querySelector('code');
			expect(code).toBeTruthy();
			// rehype-highlight adds hljs classes
			expect(code?.className).toContain('language-javascript');
		});
	});

	describe('Combined Plugins', () => {
		it('works with multiple plugins', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeHighlight]}
				>
					{`## Table

| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |

## Code

\`\`\`typescript
const greeting: string = "Hello";
\`\`\`

~~Strikethrough text~~`}
				</Markdown>,
				container
			);

			// Check table from remark-gfm
			expect(container.querySelector('table')).toBeTruthy();

			// Check strikethrough from remark-gfm
			expect(container.querySelector('del')).toBeTruthy();

			// Check syntax highlighting from rehype-highlight
			const code = container.querySelector('code');
			expect(code?.className).toContain('language-typescript');
		});
	});
});
