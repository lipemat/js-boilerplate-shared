#!/usr/bin/env node

/**
 * When using PNP loose mode, we get warnings for every module
 * we access, not strictly declared.
 *
 * No built-in way in Yarn to disable the warnings.
 * This script modifies to generate .pnp.js file to suppress
 * all loose module warnings unless the environmental variable
 * it set to display all warnings.
 *
 * @example
 * ```json
 * {
 *      "scripts": {
 *           "postinstall": "lipemat-js-boilerplate fix-pnp"
 *      }
 *  }
 * ```
 */

import fs from 'fs';

const PNP_FILES = [
	'./.pnp.js',
	'./.pnp.cjs',
	'./.pnp.mjs',
];

PNP_FILES.forEach( PNP_FILE => {
	if ( fs.existsSync( PNP_FILE ) ) {
		fs.readFile( PNP_FILE, 'utf8', ( readError, data ) => {
			if ( readError ) {
				return console.error( readError );
			}

			const result = data.replace( /if \(reference != null\) {/, '// # Warnings suppressed via @lipemat/js-boilerplate/fix-pnp script. \n' +
				'if (! alwaysWarnOnFallback && reference != null) { \n' +
				'dependencyReference = reference; \n' +
				'} else if (alwaysWarnOnFallback && reference != null) {' );

			fs.writeFile( PNP_FILE, result, 'utf8', writeError => {
				if ( writeError ) {
					return console.error( writeError );
				}
				console.debug( `The ${PNP_FILE} file has been adjusted to no longer display warnings for loose modules.` );
			} );
		} );
	}
} );
