/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0
const WARN = 1
const ERR = 2
/* eslint-enable @typescript-eslint/no-unused-vars */

module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier", // this must be last
  ],

  rules: {
    "@typescript-eslint/consistent-type-definitions": [ERR, "interface"], // prefer interface over type if both can work
    "@typescript-eslint/no-empty-interface": OFF,
  },
}
