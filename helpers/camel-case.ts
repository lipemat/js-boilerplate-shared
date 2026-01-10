/**
 * Convert a dash/dot/underscore/space separated string to camelCase or PascalCase
 *
 * Inspired by the 'camelcase' npm package, no longer maintained.
 *
 * ```ts
 * import camelCase from '../helpers/camel-case';
 *
 * camelCase('foo-bar');
 * //=> 'fooBar'
 *
 * camelCase('foo_bar');
 * //=> 'fooBar'
 *
 * camelCase('Foo-Bar');
 * //=> 'fooBar'
 *
 * camelCase('Foo-Bar', true);
 * //=> 'FooBar'
 *
 * camelCase('--foo.bar', false);
 * //=> 'fooBar'
 *
 * camelCase('foo bar');
 * //=> 'fooBar'
 *
 * camelCase('--foo-bar');
 * //=> 'fooBar'
 *
 * camelCase(['foo', 'bar']);
 * //=> 'fooBar'
 *
 * camelCase(['__foo__', '--bar'], pascalCase);
 * //=> 'FooBar'
 * ```
 */

function preserveCamelCase( string: string ): string {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for ( let i = 0; i < string.length; i++ ) {
		const character = string[ i ];

		if ( isLastCharLower && /[a-zA-Z]/.test( character ) && character.toUpperCase() === character ) {
			string = string.slice( 0, i ) + '-' + string.slice( i );
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if ( isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test( character ) && character.toLowerCase() === character ) {
			string = string.slice( 0, i - 1 ) + '-' + string.slice( i - 1 );
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
		}
	}

	return string;
}


export default function camelCase( input: string | ReadonlyArray<string>, pascalCase: boolean = false ): string {
	let value: string;
	if ( 'string' === typeof input ) {
		value = input.trim();
	} else {
		value = input.map( x => x.trim() )
			.filter( ( item: string ) => item.length > 0 )
			.join( '-' );
	}

	if ( 0 === value.length ) {
		return '';
	}

	if ( 1 === value.length ) {
		return pascalCase ? value.toUpperCase() : value.toLowerCase();
	}

	if ( value !== value.toLowerCase() ) {
		value = preserveCamelCase( value );
	}

	value = value
		.replace( /^[_.\- ]+/, '' )
		.toLowerCase()
		.replace( /[_.\- ]+(\w|$)/g, ( _, p1 ) => p1.toUpperCase() )
		.replace( /\d+(\w|$)/g, m => m.toUpperCase() );

	if ( pascalCase ) {
		value = value.charAt( 0 ).toUpperCase() + value.slice( 1 )
	}

	return value;
}
