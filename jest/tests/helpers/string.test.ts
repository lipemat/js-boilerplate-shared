import {addLeadingSlash, addTrailingSlash, normalizePath, removeLeadingSlash, removeTrailingSlash} from '../../../helpers/string.js';

describe( 'string helper', () => {
	describe( 'addTrailingSlash', () => {
		test( 'should add a trailing slash to a URL that does not have one', () => {
			expect( addTrailingSlash( 'https://example.com' ) ).toBe( 'https://example.com/' );
		} );

		test( 'should not add an additional trailing slash if one already exists', () => {
			expect( addTrailingSlash( 'https://example.com/' ) ).toBe( 'https://example.com/' );
		} );

		test( 'should return the original string if it is empty or whitespace', () => {
			expect( addTrailingSlash( '' ) ).toBe( '' );
			expect( addTrailingSlash( '   ' ) ).toBe( '   ' );
		} );

		test( 'should normalize backslashes when adding a trailing slash', () => {
			expect( addTrailingSlash( 'path\\to\\resource' ) ).toBe( 'path/to/resource/' );
		} );
	} );

	describe( 'addLeadingSlash', () => {
		test( 'should add a leading slash if it does not have one', () => {
			expect( addLeadingSlash( 'endpoint' ) ).toBe( '/endpoint' );
		} );

		test( 'should not add an additional leading slash if one already exists', () => {
			expect( addLeadingSlash( '/endpoint' ) ).toBe( '/endpoint' );
		} );

		test( 'should return the original string if it is empty or whitespace', () => {
			expect( addLeadingSlash( '' ) ).toBe( '' );
			expect( addLeadingSlash( '   ' ) ).toBe( '   ' );
		} );

		test( 'should normalize backslashes when adding a leading slash', () => {
			expect( addLeadingSlash( 'path\\to\\resource' ) ).toBe( '/path/to/resource' );
		} );
	} );

	describe( 'removeLeadingSlash', () => {
		test( 'should remove the leading slash if it exists', () => {
			expect( removeLeadingSlash( '/endpoint' ) ).toBe( 'endpoint' );
		} );

		test( 'should not change the string if it does not have a leading slash', () => {
			expect( removeLeadingSlash( 'endpoint' ) ).toBe( 'endpoint' );
		} );

		test( 'should return the original string if it is empty or whitespace', () => {
			expect( removeLeadingSlash( '' ) ).toBe( '' );
			expect( removeLeadingSlash( '   ' ) ).toBe( '   ' );
		} );

		test( 'should normalize backslashes when removing a leading slash', () => {
			expect( removeLeadingSlash( '/path\\to\\resource' ) ).toBe( 'path/to/resource' );
		} );
	} );

	describe( 'removeTrailingSlash', () => {
		test( 'should remove the trailing slash if it exists', () => {
			expect( removeTrailingSlash( 'https://example.com/' ) ).toBe( 'https://example.com' );
		} );

		test( 'should not change the string if it does not have a trailing slash', () => {
			expect( removeTrailingSlash( 'https://example.com' ) ).toBe( 'https://example.com' );
		} );

		test( 'should return the original string if it is empty or whitespace', () => {
			expect( removeTrailingSlash( '' ) ).toBe( '' );
			expect( removeTrailingSlash( '   ' ) ).toBe( '   ' );
		} );

		test( 'should normalize backslashes when removing a trailing slash', () => {
			expect( removeTrailingSlash( 'path\\to\\resource/' ) ).toBe( 'path/to/resource' );
		} );
	} );

	describe( 'normalizePath', () => {
		test( 'should replace all backslashes with forward slashes', () => {
			expect( normalizePath( 'path\\to\\some\\file.txt' ) ).toBe( 'path/to/some/file.txt' );
		} );

		test( 'should not change the string if it already uses forward slashes', () => {
			expect( normalizePath( 'path/to/some/file.txt' ) ).toBe( 'path/to/some/file.txt' );
		} );

		test( 'should handle strings with no slashes', () => {
			expect( normalizePath( 'filename.txt' ) ).toBe( 'filename.txt' );
		} );

		test( 'should handle empty strings', () => {
			expect( normalizePath( '' ) ).toBe( '' );
		} );
	} );
} );
