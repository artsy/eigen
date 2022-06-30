/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0
const WARN = 1
const ERR = 2
/* eslint-enable @typescript-eslint/no-unused-vars */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],


  rules: {
    // enable later? check these below at some point. we removed them to match our old tslint without break everything.
    // if we keep them off, then add a comment for the reason why its off
    "no-undef": OFF,
    "@typescript-eslint/no-extra-semi": OFF,
    "@typescript-eslint/ban-types": OFF,
    "@typescript-eslint/no-non-null-assertion": OFF, // for sure a warning, but later
    "@typescript-eslint/no-inferrable-types": OFF,
    "no-var": OFF,
    "@typescript-eslint/prefer-as-const": OFF,
    "no-useless-escape": OFF,
    "no-prototype-builtins": OFF,
    "no-case-declarations": OFF,
    "@typescript-eslint/no-empty-interface": OFF,
    "@typescript-eslint/no-empty-function": OFF,
    "no-async-promise-executor": OFF,
    "@typescript-eslint/ban-ts-comment": OFF,
    "no-inner-declarations": OFF,
    "@typescript-eslint/no-explicit-any": OFF, // could be a warning
    "@typescript-eslint/no-unused-vars": OFF, // could be a warning
    "@typescript-eslint/no-var-requires": OFF, // could be a warning
    "no-extra-boolean-cast": OFF, // debatable
    "no-control-regex": OFF,
    "no-constant-condition": OFF,
    "@typescript-eslint/no-non-null-asserted-optional-chain": OFF, // should be an error?
    "promise/always-return": OFF,
    "no-empty": OFF,
  },
}
