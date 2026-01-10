'use strict';
/**
 * Get the depth of the current node.
 */
function getDepth(node) {
    let depth = 0;
    let parent = node.parent;
    if ('undefined' === typeof parent) {
        return 0;
    }
    while (parent && parent.type !== 'root') {
        depth += 1;
        parent = parent.parent;
    }
    return depth;
}
function indent(node, depth, position = 'before') {
    if (node.raws[position] === undefined) {
        return;
    }
    const indentStr = '\t'.repeat(depth);
    if ('string' === typeof node.raws[position]) {
        const content = node.raws[position];
        node.raws[position] = content.trim().concat(`\n${indentStr}`);
    }
}
function processCss(node) {
    const nodeDepth = getDepth(node);
    indent(node, nodeDepth, 'before');
    indent(node, nodeDepth, 'after');
    if (0 === nodeDepth) {
        if ('undefined' === typeof node.raws.before) {
            node.raws.before = '\n\n';
        }
        else {
            node.raws.before += '\n';
        }
    }
}
const plugin = {
    postcssPlugin: 'js-boilerplate/postcss-pretty',
    OnceExit(css) {
        css.walk(processCss);
        if (css.first !== undefined && css.first.raws !== undefined) {
            css.first.raws.before = '';
        }
    },
};
export default plugin;
//# sourceMappingURL=postcss-pretty.js.map