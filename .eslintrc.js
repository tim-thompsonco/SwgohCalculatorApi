module.exports = {
	"env": {
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
        "simple-import-sort"
	],
    "rules": {
        "block-spacing": ["error"],
        "brace-style": ["error", "stroustrup"],
        "camelcase": "error",
        "comma-spacing": ["error", { "before": false, "after": true }],
        "func-style": ["error", "expression"],
        "indent": ["error", 2],
        "keyword-spacing": ["error", { "before": true, "after": true }],
        "linebreak-style": ["error", "unix"],
        "max-len": ["error", 120],
        "max-statements-per-line": ["error", { "max": 1 }],
        "no-console": "warn",
        "no-continue": "warn",
        "no-duplicate-imports": "error",
        "no-else-return": "error",
        "no-nested-ternary": "error",
        "no-unreachable-loop": "error",
        "object-curly-spacing": ["error", "always"],
        "prefer-destructuring": ["error", { "object": true, "array": true }],
        "prefer-spread": "error",
        "quotes": ["error", "single"],
        "require-atomic-updates": "error",
        "semi": ["error", "always"],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "space-before-blocks": ["error", "always"]
    }
};
