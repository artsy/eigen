const OFF = "off"
const WARN = "warn"
const ERR = "error"

module.exports = {
  root: true,
  plugins: [
    "@typescript-eslint",
    "jest",
    "no-relative-import-paths",
    "react-hooks",
    "testing-library",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "prettier", // "prettier" needs to be last!
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    /**
     * Errors
     */

    "@typescript-eslint/no-unused-vars": [
      WARN,
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": ERR, // this helps with bugs like in jsx `{foo && <Text>wow</Text>}` when foo is not a strict boolean
    "import/order": [
      ERR,
      {
        alphabetize: { order: "asc" },
        groups: ["builtin", "external", "internal", "index", "sibling", "parent", "object", "type"],
      },
    ],
    "import/no-duplicates": ERR,
    "react/jsx-curly-brace-presence": ERR,
    "react-hooks/rules-of-hooks": ERR,

    /**
     * Warnings
     */

    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { allowSameFolder: true, rootDir: "src" },
    ],

    /**
     * Disabled
     */

    "@typescript-eslint/ban-ts-comment": OFF,
    "@typescript-eslint/ban-types": OFF,
    "@typescript-eslint/explicit-module-boundary-types": OFF,
    "@typescript-eslint/no-empty-function": OFF,
    "@typescript-eslint/no-explicit-any": OFF,
    "@typescript-eslint/no-floating-promises": OFF,
    "@typescript-eslint/no-misused-promises": OFF,
    "@typescript-eslint/no-non-null-asserted-optional-chain": OFF,
    "@typescript-eslint/no-non-null-assertion": OFF,
    "@typescript-eslint/no-unsafe-argument": OFF,
    "@typescript-eslint/no-unsafe-assignment": OFF,
    "@typescript-eslint/no-unsafe-call": OFF,
    "@typescript-eslint/no-unsafe-member-access": OFF,
    "@typescript-eslint/no-unsafe-return": OFF,
    "@typescript-eslint/no-var-requires": OFF,
    "@typescript-eslint/restrict-plus-operands": OFF,
    "@typescript-eslint/restrict-template-expressions": OFF,
    "@typescript-eslint/strict-boolean-expressions": OFF,
    "@typescript-eslint/unbound-method": OFF,
    "import/default": OFF,
    "import/namespace": OFF,
    "import/no-named-as-default-member": OFF,
    "import/no-named-as-default": OFF,
    "import/no-unresolved": OFF,
    "no-control-regex": OFF,
    "no-empty-pattern": OFF,
    "no-extra-boolean-cast": OFF,
    "no-redeclare": OFF,
    "no-undef": OFF,
    "no-useless-catch": OFF,
    "no-useless-escape": OFF,
    "react-native/no-inline-styles": OFF,
    "react/react-in-jsx-scope": OFF,
  },
}
