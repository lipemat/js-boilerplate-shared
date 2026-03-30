import {getPackageConfig} from './package-config.js';
import {createRequire} from 'node:module';
import {resolve} from 'path';

const requireModule = createRequire( import.meta.url );

/**
 * Merged a configuration with a matching configuration from the project directory.
 *
 * For instance, if we have a file named config/babel.config.js in our project,
 * we will merge the contents with our config/babel.config.js in favor of whatever
 * is specified with the project's file.
 *
 * If the default export is a function, the existing configuration will be passed
 * as the only argument. Otherwise, standard `exports` are also supported.
 *
 * @example ```ts
 * // standard
 *export default = {
 *     externals: {extra: 'Extra'}
 * }
 * // function
 *  export default function(config) {
 *     return {
 *         externals: {...config.externals, extra: 'Extra'}
 *     }
 * }
 * ```
 *
 * @param {string} fileName     - Filename without extension.
 * @param {Object} mergedConfig - Existing config to merge with.
 *
 * @return {Object}
 */
export function mergeWithLocalConfig<T extends object>( fileName: string, mergedConfig: object = {} ): T {
	try {
		let localConfig = createRequire( import.meta.url )( resolve( getPackageConfig().packageDirectory, 'config', fileName.replace( /\.js$/, '' ) ) );
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
	return mergedConfig as T;
}

/**
 * Get a list of installed js-boilerplate extensions.
 *
 * - Exclude @lipemat/js-boilerplate-shared and @lipemat/js-boilerplate
 *   as they are libraries not extensions.
 */
export function getExtensions(): readonly string[] {
	const {dependencies, devDependencies} = getPackageConfig();

	return [ ...Object.keys( dependencies ), ...Object.keys( devDependencies ) ].filter( ( extension: string ) => {
		return extension.includes( 'js-boilerplate-' ) &&
			extension !== '@lipemat/js-boilerplate-shared' &&
			extension !== '@lipemat/js-boilerplate';
	} );
}

/**
 * Get a config from any existing extension's /config directories
 * merged into one.
 *
 * @param {string} fileName      - Name of the config file to load.
 * @param {Object} defaultConfig - Default config sed for passing to an extension callback.
 */
export function getExtensionsConfig<T extends object>( fileName: string, defaultConfig: T ): T {
	let mergedConfig: T = {} as T;
	for ( const extension of getExtensions() ) {
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
	}

	return mergedConfig;
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
