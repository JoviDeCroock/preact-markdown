import { describe, it, expect } from 'vitest';
import { render } from 'preact';
import { Markdown } from '../src/lite';

describe('Markdown Lite', () => {
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
				<Markdown>This is **bold** and this is *italic*.</Markdown>,
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
			render(<Markdown>This is `inline code` here.</Markdown>, container);

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
			render(<Markdown>{'> This is a quote'}</Markdown>, container);

			const blockquote = container.querySelector('blockquote');
			expect(blockquote).toBeTruthy();
			expect(blockquote?.textContent).toContain('This is a quote');
		});

		it('renders images', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>![Alt text](https://example.com/image.png)</Markdown>,
				container
			);

			const img = container.querySelector('img');
			expect(img).toBeTruthy();
			expect(img?.getAttribute('src')).toBe('https://example.com/image.png');
			expect(img?.getAttribute('alt')).toBe('Alt text');
		});

		it('renders horizontal rules', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`Above

---

Below`}
				</Markdown>,
				container
			);

			expect(container.querySelector('hr')).toBeTruthy();
		});
	});

	describe('GFM Support (built-in)', () => {
		it('renders tables', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`}
				</Markdown>,
				container
			);

			expect(container.querySelector('table')).toBeTruthy();
			expect(container.querySelector('th')).toBeTruthy();
			expect(container.querySelector('td')).toBeTruthy();
		});

		it('renders strikethrough', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown>This is ~~deleted~~ text.</Markdown>, container);

			const del = container.querySelector('del');
			expect(del).toBeTruthy();
			expect(del?.textContent).toBe('deleted');
		});

		it('renders task lists', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown>
					{`- [x] Completed task
- [ ] Incomplete task`}
				</Markdown>,
				container
			);

			const checkboxes = container.querySelectorAll('input[type="checkbox"]');
			expect(checkboxes.length).toBe(2);
		});
	});

	describe('Options', () => {
		it('applies custom className', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown className="custom-class">Hello</Markdown>, container);

			expect(container.querySelector('.custom-class')).toBeTruthy();
		});

		it('uses custom wrapper element', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown wrapper="section">Hello</Markdown>, container);

			expect(container.querySelector('section')).toBeTruthy();
		});

		it('uses default div wrapper', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(<Markdown>Hello</Markdown>, container);

			expect(container.firstChild?.nodeName).toBe('DIV');
		});
	});

	describe('Custom Components', () => {
		it('uses custom component for element', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						p: ({ children }) => <p class="custom-paragraph">{children}</p>
					}}
				>
					This is a paragraph.
				</Markdown>,
				container
			);

			const p = container.querySelector('p.custom-paragraph');
			expect(p).toBeTruthy();
		});

		it('uses custom link component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						a: ({ href, children }) => (
							<a href={href} target="_blank" rel="noopener" class="custom-link">
								{children}
							</a>
						)
					}}
				>
					[Link](https://example.com)
				</Markdown>,
				container
			);

			const link = container.querySelector('a.custom-link');
			expect(link).toBeTruthy();
			expect(link?.getAttribute('target')).toBe('_blank');
		});

		it('uses string alias for component', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown
					components={{
						h1: 'h2'
					}}
				>
					# This becomes h2
				</Markdown>,
				container
			);

			expect(container.querySelector('h1')).toBeFalsy();
			expect(container.querySelector('h2')).toBeTruthy();
		});
	});

	describe('Sanitization', () => {
		it('strips script tags when sanitize is true', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown sanitize={true}>
					{'<script>alert("xss")</script>Hello'}
				</Markdown>,
				container
			);

			expect(container.querySelector('script')).toBeFalsy();
			expect(container.textContent).toContain('Hello');
		});

		it('strips iframe tags when sanitize is true', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown sanitize={true}>
					{'<iframe src="https://evil.com"></iframe>Safe content'}
				</Markdown>,
				container
			);

			expect(container.querySelector('iframe')).toBeFalsy();
			expect(container.textContent).toContain('Safe content');
		});

		it('allows dangerous elements when sanitize is false', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown sanitize={false}>
					{'<iframe src="https://example.com"></iframe>'}
				</Markdown>,
				container
			);

			expect(container.querySelector('iframe')).toBeTruthy();
		});
	});

	describe('Marked Options', () => {
		it('respects breaks option', () => {
			const container = document.createElement('div');
			document.body.appendChild(container);
			render(
				<Markdown markedOptions={{ breaks: true }}>
					{`Line 1
Line 2`}
				</Markdown>,
				container
			);

			expect(container.querySelector('br')).toBeTruthy();
		});
	});
});
