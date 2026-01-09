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
const defaults: Partial<PackageConfig> = {
	brotliFiles: true,
	cssTsFiles: true,
	jsPath: './js',
	packageDirectory: workingDirectory,
	shortCssClasses: true,
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
 */
export function getPackageConfig(): PackageConfig {
	return packageConfig;
}

/**
 * Modify the `packageConfig` object.
 *
 * - Here mainly for testing purposes.
 */
export function modifyPackageConfig( additions: Partial<PackageConfig> ): void {
	packageConfig = {...packageConfig, ...additions};
}
