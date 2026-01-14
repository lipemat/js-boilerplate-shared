import browserslist from 'browserslist';
// @ts-expect-error
import wpBrowsers from '@wordpress/browserslist-config';

import {getBrowsersList} from '../../../helpers/browserslist.js';

afterEach( () => {
	delete process.env.BROWSERSLIST;
} );

describe( 'config', () => {
	test( 'getBrowsersList', () => {
		const expectedBrowsers = [ ...wpBrowsers ];

		// Check if the browserslist results change, which may explain other failures.
		expect( browserslist( getBrowsersList() ) ).toMatchSnapshot( 'browserslist' );
		expect( expectedBrowsers ).toMatchSnapshot( 'expectedBrowsers' );

		expect( getBrowsersList() ).toEqual( expectedBrowsers );

		const wpDefaultBrowsers = browserslist( wpBrowsers, {
			env: 'production',
		} );
		// @notice If this fails, we can probably add 'not and_uc 15.5' to adjustBrowserslist.
		expect( wpDefaultBrowsers.includes( 'and_uc 15.5' ) ).toBe( false );
		expect( wpDefaultBrowsers.includes( 'op_mini all' ) ).toBe( false );
		expect( browserslist( getBrowsersList() ).includes( 'and_uc 15.5' ) ).toBe( false );
		expect( browserslist( getBrowsersList() ).includes( 'op_mini all' ) ).toBe( false );


		process.env.BROWSERSLIST = 'chrome 71';
		expect( getBrowsersList() ).toEqual( [ 'chrome 71' ] );
	} );
} );
