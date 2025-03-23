import js from "@eslint/js";
import tseslint from "typescript-eslint";
import angularEslint from "@angular-eslint/eslint-plugin";
import angularEslintTemplate from "@angular-eslint/eslint-plugin-template";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      "@angular-eslint": angularEslint,
      "@angular-eslint/template": angularEslintTemplate,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
              message:
                "Use aliases (@shared, @users, etc.) instead of relative imports that go up multiple directories",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling"],
            "index",
          ],
          pathGroups: [
            {
              pattern: "@angular/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@shared/**",
              group: "internal",
            },
            {
              pattern: "@users/**",
              group: "internal",
            },
            {
              pattern: "@core/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["@angular/**"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@angular-eslint": angularEslint,
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["src/**/*.html"],
    plugins: {
      "@angular-eslint/template": angularEslintTemplate,
    },
    rules: {},
  },
];
