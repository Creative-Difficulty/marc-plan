module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier',
		''
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'unused-imports'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error'],
		'no-control-regex': 0
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			files: ['NavBar.svelte'],
			rules: {
				'@typescript-eslint/ban-types': [
					'error',
					{
						extendDefaults: true,
						types: {
							'{}': false
						}
					}
				]
			},
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
