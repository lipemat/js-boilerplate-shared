'use strict';

/**
 * Custom PostCSS plugin to format CSS output.
 *
 * - Fix indentation.
 *
 * Inspired by postcss-prettify.
 */


import type {Container, Plugin, Root} from 'postcss';
import type {ChildNode} from 'postcss/lib/node';
import type {AtRuleRaws} from 'postcss/lib/at-rule';

/**
 * Get the depth of the current node.
 */
function getDepth( node: ChildNode ): number {
	let depth = 0;
	let parent = node.parent;
	if ( 'undefined' === typeof parent ) {
		return 0;
	}
	while ( parent && parent.type !== 'root' ) {
		depth += 1;
		parent = parent.parent as Container<ChildNode> | undefined;
	}
	return depth;
}

function indent( node: ChildNode, depth: number, position: keyof AtRuleRaws = 'before' ) {
	if ( node.raws[ position ] === undefined ) {
		return;
	}
	const indentStr = '\t'.repeat( depth );
	if ( 'string' === typeof node.raws[ position ] ) {
		const content = node.raws[ position ] as string;
		node.raws[ position ] = content.trim().concat( `\n${indentStr}` );
	}
}

function processCss( node: ChildNode ) {
	const nodeDepth = getDepth( node );
	indent( node, nodeDepth, 'before' );
	indent( node, nodeDepth, 'after' );

	if ( 0 === nodeDepth ) {
		if ( 'undefined' === typeof node.raws.before ) {
			node.raws.before = '\n\n';
		} else {
			node.raws.before += '\n';
		}
	}
}

const plugin: Plugin = {
	postcssPlugin: 'js-boilerplate/postcss-pretty',
	OnceExit( css: Root ) {
		css.walk( processCss );
		if ( css.first !== undefined && css.first.raws !== undefined ) {
			css.first.raws.before = '';
		}
	},
};

export default plugin;
