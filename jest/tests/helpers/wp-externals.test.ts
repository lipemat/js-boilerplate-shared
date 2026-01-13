describe( 'wp-externals', () => {
	it( 'Does not change', async () => {
		expect( await import( '../../../helpers/wp-externals.js' ) ).toMatchSnapshot();
	} )
} );
