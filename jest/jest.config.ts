import type {Config} from 'jest';

const jestConfig: Config = {
	roots: [
		'./tests',
	],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/../tsconfig.json',
			},
		],
	},
	moduleNameMapper: {
		// A temporary workaround for the shared package being a symlink.
		// @todo remove once the shared package is published.
		'^@lipemat/js-boilerplate-shared$': '<rootDir>/../../js-boilerplate-shared/index.ts',
	},
};

export default jestConfig;
