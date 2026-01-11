import { type VNode, h } from 'preact';
import { useMemo } from 'preact/hooks';
import { marked, type MarkedOptions, type MarkedExtension } from 'marked';
import type { Components, Options } from './types';

/**
 * Options for the Markdown component
 */
export interface MarkdownOptions extends Options {
	/** Marked options for markdown processing */
	markedOptions?: MarkedOptions;
	/** Marked extensions for extending functionality */
	extensions?: MarkedExtension[];
	/** Whether to sanitize HTML */
	sanitize?: boolean;
}

/**
 * Props for the Markdown component
 */
export interface MarkdownProps extends MarkdownOptions {
	/** The markdown content to render */
	children: string;
}

/**
 * Parse HTML string and convert to Preact VNodes
 */
function htmlToPreact(
	html: string,
	components: Components,
	sanitize: boolean
): (VNode | string)[] {
	// Create a temporary container to parse HTML
	const template = document.createElement('template');
	template.innerHTML = html.trim();

	const nodes: (VNode | string)[] = [];
	const fragment = template.content;

	function processNode(node: Node, key: number): VNode | string | null {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent || '';
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as Element;
			const tagName = element.tagName.toLowerCase();

			// Basic sanitization - skip script and potentially dangerous elements
			if (
				sanitize &&
				['script', 'iframe', 'object', 'embed', 'form'].includes(tagName)
			) {
				return null;
			}

			// Convert attributes to props
			const props: Record<string, any> = { key };
			for (const attr of Array.from(element.attributes)) {
				let name = attr.name;
				// Convert HTML attributes to React/Preact equivalents
				if (name === 'class') name = 'class';
				else if (name === 'for') name = 'for';

				// Skip event handlers for security
				if (sanitize && name.startsWith('on')) continue;

				props[name] = attr.value;
			}

			// Process children
			const children: (VNode | string)[] = [];
			let childKey = 0;
			for (const child of Array.from(element.childNodes)) {
				const result = processNode(child, childKey++);
				if (result !== null) {
					children.push(result);
				}
			}

			const Component = components[tagName] || tagName;
			return h(Component as any, props, ...children);
		}

		return null;
	}

	let key = 0;
	for (const child of Array.from(fragment.childNodes)) {
		const result = processNode(child, key++);
		if (result !== null) {
			nodes.push(result);
		}
	}

	return nodes;
}

/**
 * Lite Markdown component for Preact using marked
 *
 * @example
 * ```tsx
 * import { Markdown } from 'preact-md/lite';
 *
 * function App() {
 *   return (
 *     <Markdown>
 *       # Hello World
 *       This is **markdown**!
 *     </Markdown>
 *   );
 * }
 * ```
 *
 * @example With marked extensions
 * ```tsx
 * import { Markdown } from 'preact-md/lite';
 * import { gfmHeadingId } from 'marked-gfm-heading-id';
 *
 * function App() {
 *   return (
 *     <Markdown extensions={[gfmHeadingId()]}>
 *       # Hello World
 *     </Markdown>
 *   );
 * }
 * ```
 *
 * @example With custom components
 * ```tsx
 * import { Markdown } from 'preact-md/lite';
 *
 * function App() {
 *   return (
 *     <Markdown
 *       components={{
 *         a: ({ href, children }) => <a href={href} target="_blank">{children}</a>,
 *       }}
 *     >
 *       Check out [this link](https://example.com).
 *     </Markdown>
 *   );
 * }
 * ```
 */
export function Markdown({
	children,
	wrapper = 'div',
	className,
	sanitize = true,
	markedOptions = {},
	extensions = [],
	components = {}
}: MarkdownProps): VNode {
	const content = useMemo(() => {
		// Configure marked with extensions
		if (extensions.length > 0) {
			marked.use(...extensions);
		}

		// Parse markdown to HTML
		const html = marked.parse(children, {
			async: false,
			gfm: true,
			breaks: false,
			...markedOptions
		}) as string;

		// Convert HTML to Preact VNodes
		return htmlToPreact(html, components, sanitize);
	}, [children, sanitize, markedOptions, extensions, components]);

	return h(wrapper, { className }, ...content);
}

export default Markdown;
