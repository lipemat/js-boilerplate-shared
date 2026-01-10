import {resolve} from 'path';
import {existsSync} from 'fs';
import postcssPresetEnv, {type pluginOptions} from 'postcss-preset-env';
import type Processor from 'postcss/lib/processor';
import {getBrowsersList} from '../helpers/config.js';
import PrettyPlugin from '../lib/postcss-pretty.js';
import cleanCSS from '../lib/postcss-clean.js';
import type {Config, ConfigPlugin} from 'postcss-load-config';
import type {LoaderContext} from 'webpack';
import type {Plugin} from 'postcss';
import {createRequire} from 'node:module';
import {getPackageConfig} from '../helpers/package-config.js';

const requireModule = createRequire( import.meta.url );

export type PostcssConfig = Config & Partial<LoaderContext<Config>> & {
	plugins: Plugin[];
	parser: string;
}

function isPluginsArray( value: ConfigPlugin[] | false ): value is ConfigPlugin[] {
	return Array.isArray( value );
}

const packageConfig = getPackageConfig();

/**
 * Base postcss-presets-env config.
 *
 */
const presetEnv: pluginOptions = {
	browsers: [ ...getBrowsersList() ],
	features: {},
};

// Get a list of included postcss plugins based on the browser list.
const processor = postcssPresetEnv( presetEnv ) as Processor;
const includedPlugins: string[] = processor.plugins.map( ( plugin: Processor['plugins'][number] ) => {
	return 'postcssPlugin' in plugin ? plugin.postcssPlugin : '';
} );


if ( 'object' === typeof presetEnv.features && includedPlugins.includes( 'postcss-focus-visible' ) ) {
	presetEnv.features[ 'focus-visible-pseudo-class' ] = {
		/**
		 * Fixes `focus-visible` feature for CSS modules.
		 *
		 * Only needed if our browser list includes non-supported browsers
		 * such as Safari 15.3 and below.
		 *
		 * Requires `focus-visible` polyfill to be loaded externally.
		 * Most will often need it site wide on pages, which do and don't use the JS app.
		 *
		 * @link https://unpkg.com/focus-visible@5.2.0/dist/focus-visible.min.js
		 */
		replaceWith: ':global(.focus-visible)',
	};
}

/**
 * Provide CSS properties and media queries to all postcss plugins.
 *
 * If a media-queries files exist, automatically load them.
 * If CSS variables exist, automatically load them.
 *
 * 1. pcss/globals/variables.pcss
 * 2. js/src/pcss/variables.pcss
 * 3. pcss/globals/media-queries.pcss
 * 4. js/src/pcss/media-queries.pcss
 */
const externalFiles: string[] = [];
[
	resolve( packageConfig.packageDirectory, 'pcss/globals/media-queries.pcss' ),
	resolve( packageConfig.packageDirectory, 'pcss/globals/variables.pcss' ),
	resolve( packageConfig.workingDirectory, 'src/pcss/media-queries.pcss' ),
	resolve( packageConfig.workingDirectory, 'src/pcss/variables.pcss' ),
].forEach( ( possibleFile: string ) => {
	if ( existsSync( possibleFile ) ) {
		externalFiles.push( possibleFile );
	}
} );


/**
 * Put the config together.
 */
const config: PostcssConfig = {
	plugins: [
		requireModule( '@csstools/postcss-global-data' )( {
			files: externalFiles,
		} ),
		requireModule( 'postcss-import' )( {
			skipDuplicates: false,
		} ),
		requireModule( 'postcss-custom-media' ),
		requireModule( 'postcss-nested' ),
		postcssPresetEnv( presetEnv ),
		requireModule( 'postcss-color-mod-function' ),
		requireModule( 'postcss-sort-media-queries' )( {
			onlyTopLevel: true,
			sort: 'mobile-first',
			configuration: {
				unitlessMqAlwaysFirst: true,
			},
		} ),
	],
	parser: 'postcss-scss',
};


if ( isPluginsArray( config.plugins ) ) {
	if ( 'production' === process.env.NODE_ENV ) {
		// For production, we minify it.
		config.plugins.push( cleanCSS( {
			level: 2,
		} ) );
	} else {
		config.plugins.push( PrettyPlugin );
		config.sourceMap = true;
	}
}

export default config;
