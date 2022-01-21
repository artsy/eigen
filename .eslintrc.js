/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0
const WARN = 1
const ERR = 2
/* eslint-enable @typescript-eslint/no-unused-vars */

module.exports = {
  root: true,

  settings: {
    react: { version: "detect" },
    "import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
  overrides: [
    {
      // only for typescript
      files: ["*.ts", "*.tsx"],
      parserOptions: { project: ["./tsconfig.json"] },
    },
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "react", "relay", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:relay/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // this must be last
  ],

  ignorePatterns: ["src/palette/**/*test.*", "dangerfile.ts"],

  rules: {
    "arrow-parens": [ERR, "always"],
    "@typescript-eslint/consistent-type-definitions": [ERR, "interface"],
    "@typescript-eslint/no-empty-interface": OFF,
    "@typescript-eslint/strict-boolean-expressions": OFF, // not sure about this one yet
    "@typescript-eslint/ban-ts-comment": OFF, // let us add ts comments for missing types etc
    "@typescript-eslint/naming-convention": [
      ERR,
      {
        selector: "function",
        format: [
          "camelCase", // regular funcs
          "PascalCase", // react components
        ],
      },
    ],
    "no-restricted-imports": [
      ERR,
      {
        paths: [
          {
            name: "react-test-renderer",
            importNames: ["create"],
            message: "Please use renderWithWrappersTL",
          },
        ],
      },
    ],
    "react/jsx-boolean-value": [ERR, "never"],
    "react/jsx-curly-brace-presence": [ERR, "never"],

    // a bunch of rules turned off to match our old tslint
    "@typescript-eslint/no-explicit-any": OFF, // could be a warning
    "@typescript-eslint/no-unused-vars": OFF, // could be a warning
    "@typescript-eslint/no-var-requires": OFF, // could be a warning
    "@typescript-eslint/no-non-null-assertion": OFF, // could be a warning
    "@typescript-eslint/no-inferrable-types": OFF, // debatable
    "no-extra-boolean-cast": OFF,
    "react/prop-types": OFF,
    "react/no-unescaped-entities": OFF, // could be a warning
    "react/display-name": OFF, // could be a warning
    "@typescript-eslint/no-non-null-asserted-optional-chain": OFF, // should be an error?
    "relay/unused-fields": OFF, // could be a warning
    "relay/generated-flow-types": OFF, // this plugin is being weird and its not seeing the types correctly
    "relay/must-colocate-fragment-spreads": OFF, // shoudl be an error
    "relay/no-future-added-value": OFF, // warning?
    // "no-console": WARN,
    "import/order": OFF, // should be the line below
    // "import/order": [ERR, { "newlines-between": "always", alphabetize: { order: "asc" } }],
    // custom rule missing still:   "jsx-safe-conditionals": true,
    "import/no-named-as-default": OFF, // could be a warning
    "import/no-named-as-default-member": OFF, // could be an error
    "import/namespace": OFF, // could be a warning
  },
}
