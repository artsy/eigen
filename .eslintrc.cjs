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
    "no-useless-escape": OFF,
    // "arrow-parens": [ERR, "always"],
  },
}
