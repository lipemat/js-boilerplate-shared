import jestConfig from '../config/jest.config.js';

jestConfig.moduleNameMapper = {
	...jestConfig.moduleNameMapper,
};

export default jestConfig;
