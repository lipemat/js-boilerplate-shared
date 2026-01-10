import config from '@lipemat/eslint-config';

export default [
	...config,
	{
		// Ignore built .js files
		ignores: [ '**/*.js', '**/*.jsx', '**/*.mjs', "jest/*" ],
	}
];
