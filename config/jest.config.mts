import type {Config} from 'jest';

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
};

export default jestConfig;
