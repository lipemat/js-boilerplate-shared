import type {Config} from 'jest';
import {resolve} from 'path';
import {existsSync} from 'fs';
import {getPackageConfig} from '../helpers/package-config.js';

const jestConfig: Config = {
	globals: {
		__TEST__: true,
	},
	roots: [
		'./tests',
	],
	transform: {
		'^.+\\.m?[tj]sx?$': [ 'babel-jest', {
			presets: [
				[ '@babel/preset-env', {targets: {node: 'current'}} ],
				'@babel/preset-typescript',
			],
			plugins: [
				[ 'babel-plugin-transform-import-meta', {module: 'ES6'} ],
			],
		} ],
	},
	transformIgnorePatterns: [
		'node_modules/(?!@lipemat)',
	],
	moduleNameMapper: {
		'\\.(pcss|less|css)$': 'identity-obj-proxy',
		// Support using `$src` to refer to the project's source directory.
		'^\\$src/(.*)$': '<rootDir>/../src/$1',
	},
	setupFilesAfterEnv: [
		resolve( getPackageConfig().workingDirectory, 'jest/setup.ts' ),
		resolve( getPackageConfig().packageDirectory, 'jest/setup.ts' ),
	].filter( existsSync ),
};

export default jestConfig;
