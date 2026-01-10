import { type VNode, h } from 'preact';
import { useMemo } from 'preact/hooks';
import { unified, type Plugin } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type { Schema } from 'hast-util-sanitize';

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
 */
export function Markdown({
	children,
	wrapper = 'div',
	className,
	sanitize = true,
	remarkPlugins = [],
	rehypePlugins = [],
	remarkRehypeOptions = {},
}: MarkdownProps): VNode {
	const html = useMemo(() => {
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

		// Convert markdown to HTML
		processor = processor.use(remarkRehype as any, {
			allowDangerousHtml: !sanitize,
			...remarkRehypeOptions,
		});

		// Apply sanitization if enabled
		if (sanitize) {
			const schema = sanitize === true ? defaultSchema : sanitize;
			processor = processor.use(rehypeSanitize as any, schema);
		}

		// Apply rehype plugins
		for (const plugin of rehypePlugins) {
			if (Array.isArray(plugin)) {
				processor = processor.use(plugin[0] as any, ...plugin.slice(1));
			} else {
				processor = processor.use(plugin as any);
			}
		}

		// Convert to HTML string
		processor = processor.use(rehypeStringify as any);

		const result = processor.processSync(children);
		return String(result);
	}, [children, sanitize, remarkPlugins, rehypePlugins, remarkRehypeOptions]);

	return h(wrapper, {
		className,
		dangerouslySetInnerHTML: { __html: html },
	});
}

export default Markdown;
