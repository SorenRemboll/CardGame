import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			"no-undef": 'off',
			// Disable all a11y rules
			'svelte/valid-compile': ['error', { ignoreWarnings: true }]
		}
	},
	{
		files: [
			'**/*.svelte',
			'**/*.svelte.ts',
			'**/*.svelte.js'
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			// Disable all Svelte a11y warnings
			'svelte/no-at-html-tags': 'off',
			'svelte/a11y-accesskey': 'off',
			'svelte/a11y-aria-activedescendant-has-tabindex': 'off',
			'svelte/a11y-aria-attributes': 'off',
			'svelte/a11y-autofocus': 'off',
			'svelte/a11y-click-events-have-key-events': 'off',
			'svelte/a11y-distracting-elements': 'off',
			'svelte/a11y-hidden': 'off',
			'svelte/a11y-img-redundant-alt': 'off',
			'svelte/a11y-incorrect-aria-attribute-type': 'off',
			'svelte/a11y-interactive-supports-focus': 'off',
			'svelte/a11y-label-has-associated-control': 'off',
			'svelte/a11y-media-has-caption': 'off',
			'svelte/a11y-misplaced-role': 'off',
			'svelte/a11y-misplaced-scope': 'off',
			'svelte/a11y-missing-attribute': 'off',
			'svelte/a11y-missing-content': 'off',
			'svelte/a11y-mouse-events-have-key-events': 'off',
			'svelte/a11y-no-abstract-role': 'off',
			'svelte/a11y-no-interactive-element-to-noninteractive-role': 'off',
			'svelte/a11y-no-noninteractive-element-interactions': 'off',
			'svelte/a11y-no-noninteractive-element-to-interactive-role': 'off',
			'svelte/a11y-no-noninteractive-tabindex': 'off',
			'svelte/a11y-no-redundant-roles': 'off',
			'svelte/a11y-no-static-element-interactions': 'off',
			'svelte/a11y-positive-tabindex': 'off',
			'svelte/a11y-role-has-required-aria-props': 'off',
			'svelte/a11y-role-supports-aria-props': 'off',
			'svelte/a11y-structure': 'off',
			'svelte/a11y-unknown-aria-attribute': 'off',
			'svelte/a11y-unknown-role': 'off'
		}
	}
);
