import { type VNode, h, type ComponentType, type JSX } from 'preact';
import { useMemo } from 'preact/hooks';
import { unified, type Plugin } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';
import type { Root, Element, Text, RootContent } from 'hast';

/**
 * Props passed to custom component renderers
 */
export interface ComponentProps {
	children?: VNode | VNode[] | string | null;
	[key: string]: any;
}

/**
 * Map of element names to custom component renderers
 */
export type Components = {
	[K in keyof JSX.IntrinsicElements]?: ComponentType<ComponentProps> | keyof JSX.IntrinsicElements;
} & {
	[key: string]: ComponentType<ComponentProps> | keyof JSX.IntrinsicElements;
};

/**
 * Options for the Markdown component
 */
export interface MarkdownOptions {
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
	/** Custom components to use for rendering elements */
	components?: Components;
}

/**
 * Props for the Markdown component
 */
export interface MarkdownProps extends MarkdownOptions {
	/** The markdown content to render */
	children: string;
}

/**
 * Markdown component for Preact using remark/rehype
 *
 * This component uses the unified ecosystem (remark/rehype) to parse and render
 * markdown content. It supports plugins for extending functionality.
 *
 * @example
 * ```tsx
 * import { Markdown } from 'preact-markdown';
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
 * @example With plugins
 * ```tsx
 * import { Markdown } from 'preact-markdown';
 * import remarkGfm from 'remark-gfm';
 * import rehypeHighlight from 'rehype-highlight';
 *
 * function App() {
 *   return (
 *     <Markdown
 *       remarkPlugins={[remarkGfm]}
 *       rehypePlugins={[rehypeHighlight]}
 *     >
 *       # Hello World
 *
 *       | Column 1 | Column 2 |
 *       |----------|----------|
 *       | Cell 1   | Cell 2   |
 *     </Markdown>
 *   );
 * }
 * ```
 *
 * @example With custom components
 * ```tsx
 * import { Markdown } from 'preact-markdown';
 *
 * function App() {
 *   return (
 *     <Markdown
 *       components={{
 *         p: ({ children }) => <p class="custom-paragraph">{children}</p>,
 *         a: ({ href, children }) => <a href={href} class="custom-link" target="_blank">{children}</a>,
 *       }}
 *     >
 *       This is a paragraph with a [link](https://example.com).
 *     </Markdown>
 *   );
 * }
 * ```
 */

/**
 * Convert HAST properties to Preact-compatible props
 */
function hastPropsToPreact(properties: Record<string, any> = {}): Record<string, any> {
	const props: Record<string, any> = {};

	for (const [key, value] of Object.entries(properties)) {
		if (key === 'className' || key === 'class') {
			props.class = Array.isArray(value) ? value.join(' ') : value;
		} else if (key === 'htmlFor') {
			props.for = value;
		} else if (key.startsWith('data') || key.startsWith('aria')) {
			props[key] = value;
		} else {
			props[key] = value;
		}
	}

	return props;
}

/**
 * Convert a HAST node to a Preact VNode
 */
function hastToPreact(
	node: RootContent,
	components: Components,
	key: number
): VNode | string | null {
	if (node.type === 'text') {
		return (node as Text).value;
	}

	if (node.type === 'element') {
		const element = node as Element;
		const tagName = element.tagName;
		const props = hastPropsToPreact(element.properties);
		props.key = key;

		const children = element.children
			.map((child, i) => hastToPreact(child, components, i))
			.filter((child): child is VNode | string => child !== null);

		const Component = components[tagName] || tagName;

		return h(Component as any, props, ...children);
	}

	// Skip comments, doctype, etc.
	return null;
}

/**
 * Convert a HAST tree to Preact VNodes
 */
function hastTreeToPreact(tree: Root, components: Components): (VNode | string)[] {
	return tree.children
		.map((child, i) => hastToPreact(child, components, i))
		.filter((child): child is VNode | string => child !== null);
}

export function Markdown({
	children,
	wrapper = 'div',
	className,
	sanitize = true,
	remarkPlugins = [],
	rehypePlugins = [],
	remarkRehypeOptions = {},
	components = {},
}: MarkdownProps): VNode {
	const content = useMemo(() => {
		let processor = unified()
			.use(remarkParse);

		// Apply remark plugins
		for (const plugin of remarkPlugins) {
			if (Array.isArray(plugin)) {
				processor = processor.use(plugin[0] as any, ...plugin.slice(1));
			} else {
				processor = processor.use(plugin as any);
			}
		}

		// Convert markdown to HAST
		processor = processor.use(remarkRehype as any, remarkRehypeOptions);

		if (sanitize) {
			processor = processor.use(rehypeSanitize as any, sanitize === true ? defaultSchema : sanitize);
		}

		// Apply rehype plugins
		for (const plugin of rehypePlugins) {
			if (Array.isArray(plugin)) {
				processor = processor.use(plugin[0] as any, ...plugin.slice(1));
			} else {
				processor = processor.use(plugin as any);
			}
		}

		const tree = processor.runSync(processor.parse(children));
		return hastTreeToPreact(tree as Root, components);
	}, [children, sanitize, remarkPlugins, rehypePlugins, remarkRehypeOptions, components]);

	return h(wrapper, { className }, ...content);
}

export default Markdown;
