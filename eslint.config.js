"use strict";

const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const globals = require("globals");

module.exports = [
	{
		ignores: ["dist", "SnowTransfer", "examples", "node_modules"]
	},
	js.configs.recommended,
	{
		files: ["**/*.ts", "**/*.js"],
		languageOptions: {
			parser: tsparser,
			ecmaVersion: 2019,
			sourceType: "commonjs",
			globals: {
				...globals.node,
				...globals.es2024
			}
		},
		plugins: {
			"@typescript-eslint": tseslint
		},
		rules: {
			...tseslint.configs.recommended.rules,
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-require-imports": "off",
			"indent": [
				"error",
				"tab",
				{ "flatTernaryExpressions": true }
			],
			"quotes": [
				"error",
				"double"
			],
			"semi": [
				"error",
				"always"
			]
		}
	}
];
