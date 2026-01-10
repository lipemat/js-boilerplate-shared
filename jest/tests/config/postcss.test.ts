import {readFileSync} from 'fs';
import {basename} from 'path';
import postcss, {type Plugin} from 'postcss';
import browserslist from 'browserslist';
import postcssPresetEnv from 'postcss-preset-env';
import type {PostcssConfig} from '../../../config/postcss.config.js';
import {sync} from 'glob';

export type Fixture = {
	input: string;
	output: string;
	basename: string;
	description: string;
}


/**
 * @notice We can't reset the modules of MiniCssExtractPlugin conflicts with
 *         itself. Instead, we isolate other configurations to allow them to
 *         load fresh each time.
 */
function getPostCSSConfig(): PostcssConfig {
	// @ts-ignore
	let config: PostcssConfig = {};
	jest.isolateModules( () => {
		config = require( '../../../config/postcss.config.ts' ).default;
	} );
	return config;
}

function processPostCSS( input: string ): Promise<postcss.Result> {
	const config = getPostCSSConfig();
	return postcss( config.plugins ).process( input, {
		from: 'test.css',
		parser: require( config.parser ),
	} );
}

type FromPresetEnv = Plugin & {
	plugins: Plugin[];
}

const getPresetEnv = ( browsers: string[], features = {} ): FromPresetEnv => {
	return postcssPresetEnv( {
		browsers,
		features: {...features},
	} ) as FromPresetEnv;
};


function getBrowsersPlugin( plugins: Plugin[] ): { plugins: Plugin[] } {
	// eslint-disable-next-line @typescript-eslint/no-restricted-types
	return plugins.find( plugin => 'postcss-preset-env' === plugin.postcssPlugin ) as unknown as {
		plugins: Plugin[]
	};
}

// Create a data provider for fixtures.
const fixtures: Fixture[] =
	sync( 'jest/fixtures/{postcss,safari-15}/*.pcss' )
		.map( ( file: string ) => {
			return {
				basename: basename( file ),
				input: file,
				output: file.replace( '.pcss', '.css' ),
				description: file.replace( /\\/g, '/' ).replace( 'jest/fixtures/', '' ),
			};
		} );

afterEach( () => {
	process.env.NODE_ENV = 'test';
	delete process.env.BROWSERSLIST;
} );


describe( 'postcss.js', () => {
	test( 'PostCSS config', () => {
		/**
		 * @notice If the browserslist results change, the snapshot will need to be updated.
		 */
		expect( getPostCSSConfig() ).toMatchSnapshot( 'develop' );

		process.env.NODE_ENV = 'production';
		expect( getPostCSSConfig() ).toMatchSnapshot( 'production' );
	} );


	test( 'sourceMap', () => {
		expect( getPostCSSConfig().sourceMap ).toEqual( true );

		process.env.NODE_ENV = 'production';
		expect( getPostCSSConfig().sourceMap ).not.toBeDefined();
	} );


	test( 'Browserslist config', () => {
		const expectedBrowsers = [ ...require( '@wordpress/browserslist-config' ) ];

		const config = getPostCSSConfig();
		// We want to make sure no matter what postcss-custom-properties is not included
		// if a user did not provided a custom browserslist to override.
		expect( getBrowsersPlugin( config.plugins ).plugins?.filter( plugin => {
			return 'postcss-custom-properties' === plugin.postcssPlugin;
		} ).length ).toEqual( 0 );
		expect( getBrowsersPlugin( config.plugins ).plugins?.filter( plugin => {
			return 'postcss-focus-visible' === plugin.postcssPlugin;
		} ).length ).toEqual( 0 );

		expect( JSON.stringify( config.plugins[ 4 ] ) )
			.toEqual( JSON.stringify( getPresetEnv( expectedBrowsers ) ) );

		// op_mini all requires postcss-custom-properties.
		process.env.BROWSERSLIST = 'op_mini all';
		const config2 = getPostCSSConfig();
		expect( getBrowsersPlugin( config2.plugins ).plugins?.filter( plugin => {
			return 'postcss-custom-properties' === plugin.postcssPlugin;
		} ).length ).toEqual( 1 );
		expect( JSON.stringify( getBrowsersPlugin( config2.plugins ) ) )
			.toEqual( JSON.stringify( getPresetEnv( [ 'op_mini all' ] ) ) );

		// Safari 15 requires postcss-focus-visible.
		process.env.BROWSERSLIST = 'safari 15';
		const config3 = getPostCSSConfig();
		expect( getBrowsersPlugin( config3.plugins ).plugins?.filter( plugin => {
			return 'postcss-focus-visible' === plugin.postcssPlugin;
		} ).length ).toEqual( 1 );
		expect( JSON.stringify( getBrowsersPlugin( config3.plugins ) ) )
			.toEqual( JSON.stringify( getPresetEnv( [ 'safari 15' ], {
				'focus-visible-pseudo-class': {
					replaceWith: ':global(.focus-visible)',
				},
			} ) ) );

		// @notice If this fails, we can probably change the toEqual to 1 as WP is now out of date.
		const wpDefaultBrowsers = [ ...require( '@wordpress/browserslist-config' ) ];
		// @ts-ignore
		process.env.BROWSERSLIST = browserslist( wpDefaultBrowsers );
		expect( getBrowsersPlugin( getPostCSSConfig().plugins ).plugins?.filter( plugin => {
			return 'postcss-custom-properties' === plugin.postcssPlugin;
		} ).length ).toEqual( 0 );
	} );


	test.each( fixtures )( 'PostCSS fixtures ( $description )', async fixture => {
		if ( fixture.input.includes( 'safari-15' ) ) {
			process.env.BROWSERSLIST = 'safari 15';
		}

		const input = readFileSync( fixture.input, 'utf8' );
		let output = readFileSync( fixture.output.replace( '.css', '.raw.css' ), 'utf8' );
		let result = await processPostCSS( input );
		expect( result.css.trim() ).toEqual( output.trim() );

		process.env.NODE_ENV = 'production';
		result = await processPostCSS( input );
		output = readFileSync( fixture.output.replace( '.css', '.raw.min.css' ), 'utf8' );
		expect( result.css.trim() ).toEqual( output.trim() );
	} );
} );
