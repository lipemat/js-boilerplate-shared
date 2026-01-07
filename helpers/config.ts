import {getPackageConfig} from './package-config';

const {dependencies, devDependencies} = getPackageConfig();

const extensions = [
	...Object.keys( dependencies ?? {} ).filter( name => name.includes( 'js-boilerplate-' ) ),
	...Object.keys( devDependencies ?? {} ).filter( name => name.includes( 'js-boilerplate-' ) ),
];

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
	extensions.forEach( extension => {
		try {
			let extensionConfig = require( extension + '/config/' + fileName );
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
