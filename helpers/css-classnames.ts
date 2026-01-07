import {getPackageConfig} from './package-config';
import type {GetLocalIdent} from '../types/css-loader';
import type {AtLeast} from '../utility';

export const SHORT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const classes: {
	[ filename: string ]: {
		[ className: string ]: string
	}
} = {};

let counters = [ -1 ];

/**
 * Check if short CSS classes are enabled.
 *
 * Using a helper function to allow for future enhancements.
 *
 * @since 4.6.0
 */
export function usingShortCssClasses(): boolean {
	const short = getPackageConfig().shortCssClasses;
	if ( 'object' === typeof short ) {
		return Boolean( short.js );
	}
	return Boolean( short );
}

/**
 * Reset all counters.
 *
 * @notice Mostly here for unit tests.
 */
export function resetCounters(): void {
	counters = [ -1 ];
}

/**
 * Get the next class in the sequence based on:
 * 1. Single character from SHORT_ALPHABET (prevent conflicts with JS boilerplate).
 * 2. Incremented character from the `ALPHABET`.
 *      1. Used once requires 2+ characters.
 *      2. Grows to 3+ characters as needed.
 *
 * @return {string}
 */
export function getNextClass(): string {
	const last = counters.length - 1;
	let totalLetters = ALPHABET.length - 1;

	// The first level uses the SHORT_ALPHABET.
	if ( 0 === last ) {
		totalLetters = SHORT_ALPHABET.length - 1;
	}

	if ( counters[ last ] < totalLetters ) {
		counters[ last ]++;
	} else {
		incrementParent();
	}

	return counters.map( ( counter, i ) => {
		return 0 === i ? SHORT_ALPHABET[ counter ] : ALPHABET[ counter ];
	} ).join( '' );
}


/**
 * When we run out of characters on the current level:
 * 1. Increment the parent level.
 * 2. Reset the current level and all child levels back to 0.
 *
 * If we are out of characters on the parent level or have
 * no parent level:
 * 1. Add a new child level.
 * 2. Reset all levels back to 0.
 *
 */
function incrementParent() {
	let parent = counters.length - 2;
	let totalLetters = ALPHABET.length - 1;

	while ( counters[ parent ] !== undefined ) {
		// The first level uses the SHORT_ALPHABET.
		if ( 0 === parent ) {
			totalLetters = SHORT_ALPHABET.length - 1;
		}
		if ( counters[ parent ] < totalLetters ) {
			counters[ parent ]++;
			// Reset all child levels to 0.
			while ( counters[ parent + 1 ] !== undefined ) {
				counters[ parent + 1 ] = 0;
				parent++;
			}
			return;
		}
		parent--;
	}

	// Add a new level and reset all existing levels.
	counters.forEach( ( _, i ) => counters[ i ] = 0 );
	counters.push( 0 );
}

type LocalIdentParams = Parameters<GetLocalIdent>;

/**
 * Return a single character unique CSS class name based on WebPack
 * css-loader's `getLocalIdentName` callback.
 *
 * Tracks CSS classes per each file so duplicate uses of the
 * same class in a file receive the same result.
 *
 * @notice Only enabled if the `package.json` has `shortCssClasses` set to true.
 *
 * @link https://webpack.js.org/loaders/css-loader/#getlocalident
 */
export const getLocalIdent = ( {resourcePath}: AtLeast<LocalIdentParams[0], 'resourcePath'>, _: LocalIdentParams[1], localName: LocalIdentParams[2] ): ReturnType<GetLocalIdent> => {
	classes[ resourcePath ] ||= {};
	classes[ resourcePath ][ localName ] ||= getNextClass();
	return classes[ resourcePath ][ localName ];
};
