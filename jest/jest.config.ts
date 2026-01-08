import jestConfig from '../config/jest.config.mjs';

jestConfig.moduleNameMapper = {
	...jestConfig.moduleNameMapper,
	// A temporary workaround for the shared package being a symlink.
	// @todo remove once the shared package is published.
	'^@lipemat/js-boilerplate-shared$': '<rootDir>/../../js-boilerplate-shared/index.ts',
};

export default jestConfig;
