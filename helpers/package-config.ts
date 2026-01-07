import {resolve} from 'path';
import {realpathSync} from 'node:fs';

export interface PackageConfig {
	author?: string;
	brotliFiles: boolean;
	certificates?: Certificates;
	combinedJson: boolean;
	cssTsFiles: boolean;
	css_folder: string;
	default: PackageConfig;
	dependencies: Dependencies;
	description?: string;
	devDependencies: Dependencies;
	getPackageConfig: () => PackageConfig;
	jsPath: string;
	license?: string;
	name?: string;
	packageDirectory: string;
	packageManager?: string;
	resolutions?: Dependencies;
	scripts: Partial<Scripts>;
	shortCssClasses: boolean | {
		js: boolean;
		pcss: boolean;
	};
	url: string;
	version?: string;
	workingDirectory: string;
}

export interface Dependencies {
	[ name: string ]: string;
}

export interface Certificates {
	cert: string;
	key: string;
}

export interface Scripts {
	browserslist: string;
	dist: string;
	lint: string;
	postinstall: string;
	start: string;
	test: string;
}


const workingDirectory = realpathSync( process.cwd() );
/**
 * @todo In version 11 change default values
 * 1. brotliFiles: true
 * 2. cssTsFiles: true
 * 3. shortCssClasses: true
 * 4. jsPath: './js'
 *
 * @note Must be coordinated with version 5 of postcss-boilerplate
 *
 * Update Readme.md to reflect these changes.
 */
const defaults: Partial<PackageConfig> = {
	brotliFiles: false,
	cssTsFiles: false,
	jsPath: './',
	packageDirectory: workingDirectory,
	shortCssClasses: false,
	url: 'http://localhost',
};

let packageConfig: PackageConfig = require( resolve( workingDirectory, 'package.json' ) );
packageConfig = {...defaults, ...packageConfig};
packageConfig.workingDirectory = packageConfig.jsPath !== '' ? resolve( packageConfig.jsPath ) : workingDirectory;

try {
	const localConfig = require( resolve( workingDirectory, './local-config.json' ) );
	packageConfig = {...packageConfig, ...localConfig};
} catch {
}

/**
 * Helper function to get the results of `packageConfig`.
 *
 * - Allows mocking the results of `packageConfig` for testing.
 * - Allows getting the config through a callback instead of an import.
 *
 * @since 10.3.0
 */
export function getPackageConfig(): PackageConfig {
	return packageConfig;
}
