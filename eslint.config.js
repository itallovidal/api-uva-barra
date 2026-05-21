const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "Use named functions instead of arrow functions assigned to variables. Arrow functions are only allowed for inline callbacks (e.g., .map, .filter, .forEach).",
        },
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.property.name=/^(get|post|put|delete|patch|head|options|all|route)$/] > ArrowFunctionExpression",
          message: "Use named functions for route handlers instead of arrow functions. Define the handler as a named function and pass it by reference.",
        },
      ],
    },
  },
];
