import {resolve} from 'path';
import {readFileSync, realpathSync} from 'node:fs';

function readJsonFile<T>( filePath: string ): T {
	return JSON.parse( readFileSync( filePath, 'utf8' ) ) as T;
}

export interface PackageConfig {
	author?: string;
	brotliFiles: boolean;
	certificates?: Certificates;
	combinedJson: boolean;
	cssEnums: boolean;
	cssTsFiles: boolean;
	css_folder: string;
	default: PackageConfig;
	dependencies: Dependencies;
	description?: string;
	devDependencies: Dependencies;
	getPackageConfig: () => PackageConfig;
	jsPath: string;
	license?: string;
	mainCssFileName: string;
	name?: string;
	packageDirectory: string;
	packageManager?: string;
	pcssWatch: string[];
	resolutions?: Dependencies;
	scripts: Partial<Scripts>;
	theme_path: string;
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
	css_folder: './css/dist/',
	jsPath: './js',
	mainCssFileName: 'front-end',
	packageDirectory: workingDirectory,
	pcssWatch: [ 'pcss', 'template-parts' ],
	shortCssClasses: true,
	theme_path: './',
	url: 'http://localhost',
};

let packageConfig: PackageConfig = readJsonFile<PackageConfig>( resolve( workingDirectory, 'package.json' ) );
packageConfig = {...defaults, ...packageConfig};
packageConfig.workingDirectory = packageConfig.jsPath !== '' ? resolve( packageConfig.jsPath ).replace( /\\/g, '/' ) : workingDirectory;

try {
	const localConfig = readJsonFile<Partial<PackageConfig>>( resolve( workingDirectory, './local-config.json' ) );
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
	return {...packageConfig, ...modifications};
}

/**
 * Modify the `packageConfig` object.
 *
 * - Here mainly for testing purposes.
 */
let modifications: Partial<PackageConfig> = {};

export function modifyPackageConfig( additions: Partial<PackageConfig> ): void {
	modifications = additions;
}
export function resetPackageConfig(): void {
	modifications = {};
}
