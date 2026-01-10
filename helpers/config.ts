import {getPackageConfig} from './package-config.js';
import {createRequire} from 'node:module';
// @ts-expect-error
import wpBrowsers from '@wordpress/browserslist-config';
import browserslist from 'browserslist';
import postCssConfig, {type PostcssConfig} from '../config/postcss.config.js';
import {resolve} from 'path';

const requireModule = createRequire( import.meta.url );

const {dependencies, devDependencies} = getPackageConfig();

const extensions = [ ...Object.keys( dependencies ), ...Object.keys( devDependencies ) ].filter( ( extension: string ) => {
	return extension.includes( 'js-boilerplate-' ) &&
		extension !== '@lipemat/js-boilerplate-shared' &&
		extension !== '@lipemat/js-boilerplate';
} );

/**
 * Return the postcss config merged with any extensions
 * or local config.
 *
 * @see getConfig from @lipemat/js-boilerplate
 */
export function getPostCSSConfig(): PostcssConfig {
	let mergedConfig: PostcssConfig = {...postCssConfig, ...getExtensionsConfig<PostcssConfig>( 'postcss.config', postCssConfig )};

	try {
		let localConfig = createRequire( import.meta.url )( resolve( getPackageConfig().packageDirectory, 'config', 'postcss.config' ) );
		if ( 'default' in localConfig ) {
			localConfig = localConfig.default;
		}

		if ( 'function' === typeof localConfig ) {
			mergedConfig = {...mergedConfig, ...localConfig( mergedConfig )};
		} else {
			mergedConfig = {...mergedConfig, ...localConfig};
		}
	} catch ( e ) {
		if ( e instanceof Error ) {
			if ( ! ( 'code' in e ) || ( 'MODULE_NOT_FOUND' !== e.code && 'ERR_MODULE_NOT_FOUND' !== e.code ) ) {
				console.error( e );
			}
		}
	}
	return mergedConfig;
}


/**
 * Get a config from any existing extension's /config directories
 * merged into one.
 *
 * @param {string} fileName
 * @param {Object} defaultConfig - Default config from this package.
 *                               Used for passing to an extension callback.
 *
 * @see getConfig
 *
 * @return {Object}
 */
export function getExtensionsConfig<T extends object>( fileName: string, defaultConfig: T ): T {
	let mergedConfig: T = {} as T;
	for ( const extension of extensions ) {
		try {
			let extensionConfig = requireModule( extension + '/config/' + fileName );
			// For ES Modules, we need to use the default export.
			if ( 'default' in extensionConfig ) {
				extensionConfig = extensionConfig.default;
			}
			if ( 'function' === typeof extensionConfig ) {
				mergedConfig = {...mergedConfig, ...extensionConfig( {...defaultConfig, ...mergedConfig} )};
			} else {
				mergedConfig = {...mergedConfig, ...extensionConfig};
			}
		} catch ( e ) {
			if ( e instanceof Error ) {
				if ( ! ( 'code' in e ) || 'MODULE_NOT_FOUND' !== e.code ) {
					console.error( e );
				}
			}
		}
	} );

	return mergedConfig;
}

/**
 * Get the browserslist from the current project.
 *
 * - If specified using standard browserslist config, we will use that.
 *
 *  @link https://github.com/browserslist/browserslist#config-file
 */
export function getBrowsersList(): readonly string[] {
	const projectBrowsersList = browserslist();
	if ( browserslist( browserslist.defaults ) === projectBrowsersList ) {
		return wpBrowsers;
	}
	return projectBrowsersList;
}

/**
 * Ensure the file extension is .js.
 */
export function ensureJSExtension( fileName: string ): string {
	const withoutExtension = fileName.replace( /\.(ts|js)$/, '' );
	if ( ! withoutExtension.endsWith( '.js' ) ) {
		return withoutExtension + '.js';
	}
	return withoutExtension;
}
