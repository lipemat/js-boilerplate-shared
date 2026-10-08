import postcss from 'postcss';
import cleaner from '../../../lib/postcss-clean.js';


async function minify( css: string ): Promise<string> {
	const result = await postcss( [ cleaner( {level: 2} ) ] ).process( css, {from: undefined} );
	return result.css;
}


describe( 'postcss-clean', () => {
	it( 'minifies plain CSS', async() => {
		expect( await minify( '.a {\n\tcolor: #ffffff;\n}\n' ) ).toBe( '.a{color:#fff}' );
	} );


	it( 'keeps a section sign prefixed animation name', async() => {
		const css = '@keyframes §A{from{opacity:0}to{opacity:1}}.a{animation:§A 1s linear infinite}';

		expect( await minify( css ) ).toBe( '@keyframes §A{from{opacity:0}to{opacity:1}}.a{animation:1s linear infinite §A}' );
	} );


	it( 'keeps every section sign when several animations are used', async() => {
		const output = await minify( '.a {\n\tanimation: §A 1s, §B 2s;\n}\n' );

		expect( output ).toContain( '§A' );
		expect( output ).toContain( '§B' );
		expect( output ).not.toContain( '__section_sign__' );
	} );


	it( 'keeps a circled M prefixed animation name', async() => {
		const css = '@keyframes Ⓜspin{from{opacity:0}to{opacity:1}}.a{animation:Ⓜspin 1s linear infinite}';

		expect( await minify( css ) ).toBe( '@keyframes Ⓜspin{from{opacity:0}to{opacity:1}}.a{animation:1s linear infinite Ⓜspin}' );
	} );


	it( 'keeps every circled M when several animations are used', async() => {
		const output = await minify( '.a {\n\tanimation: ⓂA 1s, ⓂB 2s;\n}\n' );

		expect( output ).toContain( 'ⓂA' );
		expect( output ).toContain( 'ⓂB' );
		expect( output ).not.toContain( '__circled_m__' );
	} );


	it( 'keeps section signs and circled Ms together', async() => {
		const output = await minify( '.a {\n\tanimation: §A 1s, ⓂB 2s;\n}\n' );

		expect( output ).toContain( '§A' );
		expect( output ).toContain( 'ⓂB' );
	} );


	it( 'rejects invalid animation values', async() => {
		await expect( minify( '.a{animation:1s 1s 1s 1s 1s 1s 1s 1s}' ) ).rejects.toThrow( 'postcss-clean minify failed!' );
	} );
} );
