/**
 * Mimic the `postcss-clean` plugin.
 *
 * Override due to the plugin using version 4 of `clean-css`, which
 * has issues with PostCSS 7/8 and results in inconsistent CSS.
 *
 * This may potentially be removed in favor of using that plugin again if
 * they change the version of PostCSS to 8 and Clean CSS to 5.
 *
 * Decided to use this `lib` instead of maintaining another fork.
 *
 * @link https://www.npmjs.com/package/postcss-clean
 */
import postCss from 'postcss';
import CleanCSS from 'clean-css';
// Clean CSS rejects animation names starting with these characters, so swap in valid identifiers while minifying.
const PLACEHOLDERS = [
    {
        char: '§',
        placeholder: '__section_sign__',
    },
    {
        char: 'Ⓜ',
        placeholder: '__circled_m__',
    },
];
const replacePlaceholders = (css, direction) => {
    return PLACEHOLDERS.reduce((swapped, { char, placeholder }) => {
        if ('encode' === direction) {
            return swapped.replaceAll(char, placeholder);
        }
        return swapped.replaceAll(placeholder, char);
    }, css);
};
const cleaner = (opts = {}) => {
    const clean = new CleanCSS(opts);
    return {
        postcssPlugin: 'clean',
        OnceExit(css, { result }) {
            return new Promise((resolve, reject) => {
                const safeCss = replacePlaceholders(css.toString(), 'encode');
                clean.minify(safeCss, (err, min) => {
                    if (null !== err) {
                        return reject(new Error(err.join('\n')));
                    }
                    if (min.warnings.length > 0) {
                        return reject(new Error('postcss-clean minify failed! \n' + min.warnings.join('\n')));
                    }
                    const restoredCss = replacePlaceholders(min.styles, 'decode');
                    result.root = postCss.parse(restoredCss);
                    resolve();
                });
            });
        },
    };
};
export const postcss = true;
export default cleaner;
//# sourceMappingURL=postcss-clean.js.map
