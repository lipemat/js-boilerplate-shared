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
		'is-plain-obj': 'identity-obj-proxy',
		uuid: 'identity-obj-proxy',
	},
	setupFilesAfterEnv: [
		resolve( getPackageConfig().workingDirectory, 'jest/setup.ts' ),
		resolve( getPackageConfig().packageDirectory, 'jest/setup.ts' ),
	].filter( existsSync ),
};

export default jestConfig;
