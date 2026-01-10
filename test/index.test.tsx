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
		it('removes javascript: protocol from links', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{'[Click me](javascript:alert("xss"))'}
				</Markdown>,
				container
			);

			const link = container.querySelector('a');
			expect(link).toBeTruthy();
			// The href should be removed (null) or empty when sanitized
			const href = link?.getAttribute('href');
			expect(href === null || href === '' || !href.includes('javascript:')).toBe(true);
		});

		it('allows safe protocols in links', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`[HTTPS](https://example.com)
[HTTP](http://example.com)
[Mail](mailto:test@example.com)`}
				</Markdown>,
				container
			);

			const links = container.querySelectorAll('a');
			expect(links.length).toBe(3);
			expect(links[0].getAttribute('href')).toBe('https://example.com');
			expect(links[1].getAttribute('href')).toBe('http://example.com');
			expect(links[2].getAttribute('href')).toBe('mailto:test@example.com');
		});

		it('removes data: protocol from images', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{'![alt](data:text/html,<script>alert("xss")</script>)'}
				</Markdown>,
				container
			);

			const img = container.querySelector('img');
			// Image should exist but src should be removed (null) or sanitized
			if (img) {
				const src = img.getAttribute('src');
				expect(src === null || src === '' || !src.includes('data:text/html')).toBe(true);
			}
		});

		it('allows safe image sources', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{'![alt text](https://example.com/image.png)'}
				</Markdown>,
				container
			);

			const img = container.querySelector('img');
			expect(img).toBeTruthy();
			expect(img?.getAttribute('src')).toBe('https://example.com/image.png');
			expect(img?.getAttribute('alt')).toBe('alt text');
		});

		it('preserves safe attributes on elements', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`# Heading

A paragraph with **bold** and *italic* text.`}
				</Markdown>,
				container
			);

			expect(container.querySelector('h1')).toBeTruthy();
			expect(container.querySelector('p')).toBeTruthy();
			expect(container.querySelector('strong')).toBeTruthy();
			expect(container.querySelector('em')).toBeTruthy();
		});

		it('can use custom sanitization schema', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			
			// Custom schema that removes all links
			const customSchema = {
				tagNames: ['p', 'strong', 'em'],
			};
			
			render(
				<Markdown sanitize={customSchema}>
					{'This has a [link](https://example.com) and **bold** text.'}
				</Markdown>,
				container
			);

			// Links should be removed with this schema
			expect(container.querySelector('a')).toBeFalsy();
			// Bold should still work
			expect(container.querySelector('strong')).toBeTruthy();
		});

		it('sanitization can be disabled', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown sanitize={false}>
					{'[Click me](javascript:void(0))'}
				</Markdown>,
				container
			);

			const link = container.querySelector('a');
			expect(link).toBeTruthy();
			// With sanitization disabled, the javascript: protocol should be preserved
			expect(link?.getAttribute('href')).toBe('javascript:void(0)');
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

	describe('Custom Components', () => {
		it('renders paragraph with custom component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						p: ({ children }) => <p class="custom-paragraph">{children}</p>,
					}}
				>
					This is a paragraph.
				</Markdown>,
				container
			);

			const p = container.querySelector('p');
			expect(p).toBeTruthy();
			expect(p?.className).toBe('custom-paragraph');
			expect(p?.textContent).toBe('This is a paragraph.');
		});

		it('renders links with custom component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						a: ({ href, children }) => (
							<a href={href} class="custom-link" target="_blank" rel="noopener">
								{children}
							</a>
						),
					}}
				>
					[Click here](https://example.com)
				</Markdown>,
				container
			);

			const link = container.querySelector('a');
			expect(link).toBeTruthy();
			expect(link?.className).toBe('custom-link');
			expect(link?.getAttribute('target')).toBe('_blank');
			expect(link?.getAttribute('rel')).toBe('noopener');
			expect(link?.getAttribute('href')).toBe('https://example.com');
		});

		it('renders headers with custom component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						h1: ({ children }) => <h1 class="title">{children}</h1>,
						h2: ({ children }) => <h2 class="subtitle">{children}</h2>,
					}}
				>
					{`# Main Title
## Sub Title`}
				</Markdown>,
				container
			);

			const h1 = container.querySelector('h1');
			const h2 = container.querySelector('h2');
			expect(h1?.className).toBe('title');
			expect(h2?.className).toBe('subtitle');
		});

		it('renders code blocks with custom component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						pre: ({ children }) => <pre class="code-block">{children}</pre>,
						code: ({ className, children }) => (
							<code class={`${className || ''} highlighted`}>{children}</code>
						),
					}}
				>
					{`\`\`\`js
const x = 1;
\`\`\``}
				</Markdown>,
				container
			);

			const pre = container.querySelector('pre');
			const code = container.querySelector('code');
			expect(pre?.className).toBe('code-block');
			expect(code?.className).toContain('highlighted');
		});

		it('renders lists with custom components', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						ul: ({ children }) => <ul class="custom-list">{children}</ul>,
						li: ({ children }) => <li class="custom-item">{children}</li>,
					}}
				>
					{`- Item 1
- Item 2`}
				</Markdown>,
				container
			);

			const ul = container.querySelector('ul');
			const items = container.querySelectorAll('li');
			expect(ul?.className).toBe('custom-list');
			expect(items.length).toBe(2);
			expect(items[0].className).toBe('custom-item');
		});

		it('can replace element with different tag', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						strong: 'b',
						em: 'i',
					}}
				>
					This is **bold** and *italic*.
				</Markdown>,
				container
			);

			expect(container.querySelector('b')).toBeTruthy();
			expect(container.querySelector('i')).toBeTruthy();
			expect(container.querySelector('strong')).toBeFalsy();
			expect(container.querySelector('em')).toBeFalsy();
		});

		it('passes through original props to custom component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						a: ({ href, children, ...props }) => (
							<a href={href} data-custom="true" {...props}>
								{children}
							</a>
						),
					}}
				>
					[Link](https://example.com)
				</Markdown>,
				container
			);

			const link = container.querySelector('a');
			expect(link?.getAttribute('href')).toBe('https://example.com');
			expect(link?.getAttribute('data-custom')).toBe('true');
		});

		it('works with plugins and custom components together', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					remarkPlugins={[remarkGfm]}
					components={{
						table: ({ children }) => (
							<table class="styled-table">{children}</table>
						),
						del: ({ children }) => (
							<span class="strikethrough">{children}</span>
						),
					}}
				>
					{`| A | B |
|---|---|
| 1 | 2 |

~~deleted~~`}
				</Markdown>,
				container
			);

			const table = container.querySelector('table');
			const del = container.querySelector('.strikethrough');
			expect(table?.className).toBe('styled-table');
			expect(del).toBeTruthy();
			expect(del?.textContent).toBe('deleted');
		});
	});
});
