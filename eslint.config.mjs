import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["dist/", "**/*.{js,mjs,cjs}"] },
  { files: ["**/*.{ts}"] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: "./tsconfig.json", // Путь к вашему tsconfig.json
        sourceType: "module",
      },
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];