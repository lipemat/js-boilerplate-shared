import {ALPHABET, getLocalIdent, getNextClass, resetCounters, SHORT_ALPHABET, usingShortCssClasses} from '../../../helpers/css-classnames';
import type {LoaderContext} from 'webpack';
import type {PackageConfig} from '../../../helpers/package-config';

// Change this variable during tests.
let mockShortCssEnabled: PackageConfig['shortCssClasses'] = false;

// Change the result of the getPackageConfig function.
jest.mock( '../../../helpers/package-config.js', () => ( {
	...jest.requireActual( '../../../helpers/package-config.js' ),
	getPackageConfig: () => ( {
		...jest.requireActual( '../../../helpers/package-config.js' ),
		// Change this variable during the test.
		shortCssClasses: mockShortCssEnabled,
	} ),
} ) );

function makeResource( path: string ): LoaderContext<{ resourcePath: string }> {
	return {
		resourcePath: path,
	} as LoaderContext<{ resourcePath: string }>;
}

describe( 'Test CSS Classname Generation', () => {
	beforeEach( () => {
		resetCounters();
	} );

	it( 'getNextClass', () => {
		expect( getNextClass() ).toEqual( 'A' );
		expect( getNextClass() ).toEqual( 'B' );

		for ( let i = 0; i < SHORT_ALPHABET.length - 2; i++ ) {
			getNextClass();
		}

		expect( getNextClass() ).toEqual( 'Aa' );
		expect( getNextClass() ).toEqual( 'Ab' );

		const third = SHORT_ALPHABET.length * ALPHABET.length;
		for ( let i = 0; i < third - 2; i++ ) {
			getNextClass();
		}

		expect( getNextClass() ).toEqual( 'Aaa' );
		expect( getNextClass() ).toEqual( 'Aab' );
	} );

	it( 'getLocalIdent', () => {
		expect( getLocalIdent( makeResource( 'E:/SVN/js-boilerplate/tests/fake.pcss' ), '', 'a-class' ) ).toEqual( 'A' );
		expect( getLocalIdent( makeResource( 'E:/SVN/js-boilerplate/tests/other.pcss',
		), '', 'a-class' ) ).toEqual( 'B' );
		expect( getLocalIdent( makeResource( 'E:/SVN/js-boilerplate/tests/other.pcss',
		), '', 'b-class' ) ).toEqual( 'C' );
		expect( getLocalIdent( makeResource( 'E:/SVN/js-boilerplate/tests/fake.pcss' ), '', 'a-class' ) ).toEqual( 'A' );
		expect( getLocalIdent( makeResource( 'E:/SVN/js-boilerplate/tests/other.pcss' ), '', 'b-class' ) ).toEqual( 'C' );
	} );

	test( 'Alphabet Length', () => {
		expect( ALPHABET.length ).toEqual( 62 );
		expect( SHORT_ALPHABET.length ).toEqual( 26 );
	} );

	test( 'Are Short CSS Classes Enabled?', () => {
		expect( usingShortCssClasses() ).toEqual( false );
		mockShortCssEnabled = true;
		expect( usingShortCssClasses() ).toEqual( true );

		mockShortCssEnabled = {
			js: false,
			pcss: true,
		};
		expect( usingShortCssClasses() ).toBe( false );

		mockShortCssEnabled = {
			js: true,
			pcss: false,
		};
		expect( usingShortCssClasses() ).toBe( true );

		mockShortCssEnabled = {
			js: true,
			pcss: true,
		};
		expect( usingShortCssClasses() ).toBe( true );
	} );
} );
