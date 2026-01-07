/** @type {import('@jest/types').Config.InitialOptions} */
import config from '@lipemat/js-boilerplate/config/jest.config.js';

config.moduleNameMapper = {
	...config.moduleNameMapper,

	// A temporary workaround for the shared package being a symlink.
	// @todo remove once the shared package is published.
	'^@lipemat/js-boilerplate-shared$': '<rootDir>/../../js-boilerplate-shared/index.ts',
};

export default config;
