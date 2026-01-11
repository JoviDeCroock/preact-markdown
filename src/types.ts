import { ComponentType, JSX, VNode } from 'preact';

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
	[K in keyof JSX.IntrinsicElements]?:
		| ComponentType<ComponentProps>
		| keyof JSX.IntrinsicElements;
} & {
	[key: string]: ComponentType<ComponentProps> | keyof JSX.IntrinsicElements;
};

/**
 * Options for the Markdown component
 */
export interface Options {
	/** Custom tag name for the wrapper element (default: 'div') */
	wrapper?: string;
	/** Additional class name for the wrapper */
	className?: string;
	/** Custom components to use for rendering elements */
	components?: Components;
}
