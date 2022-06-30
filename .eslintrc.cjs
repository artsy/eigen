/* eslint-disable @typescript-eslint/no-unused-vars */
const OFF = 0
const WARN = 1
const ERR = 2
/* eslint-enable @typescript-eslint/no-unused-vars */

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:promise/recommended",
    "@react-native-community", // https://github.com/facebook/react-native/tree/HEAD/packages/eslint-config-react-native-community
    "plugin:react-native-a11y/ios",
    "prettier", // keep this last
  ],
  plugins: [
    "@typescript-eslint",
    // react, react-hooks, react-native, jest, eslint-comments: these come from the @react-native-community extension
    "relay",
    "promise",
    "no-loops",
    "regexp",
  ],



  rules: {
    ////////////////////////////////////////
    //// DONT ADD MORE STUFF BELOW HERE ////
    ////  ! THESE ARE JUST TEMPORARY !  ////
    ////////////////////////////////////////
    // enable some later. check these below at some point. we removed them to match our old tslint without break everything.
    // if we keep them off, then add a comment for the reason why its off
    "no-undef": OFF,
    "@typescript-eslint/no-extra-semi": OFF,
    "@typescript-eslint/ban-types": OFF,
    "@typescript-eslint/no-non-null-assertion": OFF, // for sure a warning, but later
    "@typescript-eslint/no-inferrable-types": OFF,
    "no-new": OFF,
    "dot-notation": OFF,
    "no-labels": OFF,
    "no-var": OFF,
    "@typescript-eslint/prefer-as-const": OFF,
    yoda: OFF,
    "prefer-const": OFF,
    "no-useless-escape": OFF,
    "no-empty-pattern": OFF,
    "no-prototype-builtins": OFF,
    "no-self-compare": OFF,
    "no-sparse-arrays": OFF,
    "no-case-declarations": OFF,
    "@typescript-eslint/no-shadow": OFF,
    "no-catch-shadow": OFF,
    "@typescript-eslint/no-empty-interface": OFF,
    "react/no-children-prop": OFF,
    "react/no-unescaped-entities": OFF,
    "@typescript-eslint/no-empty-function": OFF,
    "jest/no-identical-title": OFF,
    "no-async-promise-executor": OFF,
    "jest/no-disabled-tests": OFF,
    "no-loops/no-loops": OFF, // should be error
    "jest/valid-expect": OFF,
    "@typescript-eslint/ban-ts-comment": OFF,
    "no-inner-declarations": OFF,
    "no-unused-vars": OFF, // use the one below?
    // "no-unused-vars": [ ERR, { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }, ],
    // "@typescript-eslint/naming-convention": [ ERR, { selector: "function", format: [ "camelCase", // regular funcs "PascalCase", // react components ], }, ],
    // "no-restricted-imports": [ ERR, { paths: [ { name: "react-test-renderer", importNames: ["create"], message: "Please use renderWithWrappersTL", }, ], }, ],
    "@typescript-eslint/no-explicit-any": OFF, // could be a warning
    "@typescript-eslint/no-unused-vars": OFF, // could be a warning
    "react-native-a11y/no-nested-touchables": OFF,
    "@typescript-eslint/no-var-requires": OFF, // could be a warning
    "no-extra-boolean-cast": OFF, // debatable
    "no-control-regex": OFF,
    "react-native-a11y/has-accessibility-hint": OFF,
    "no-constant-condition": OFF,
    "react/react-in-jsx-scope": OFF,
    "@typescript-eslint/no-non-null-asserted-optional-chain": OFF, // should be an error?
    "react-hooks/exhaustive-deps": OFF,
    "react-native-a11y/has-valid-accessibility-descriptors": OFF,
    "react-native/no-inline-styles": OFF,
    "react-native-a11y/has-valid-accessibility-ignores-invert-colors": OFF,
    "@typescript-eslint/prefer-ts-expect-error": OFF, // should be an error
    "regexp/no-useless-flag": OFF,
    "promise/always-return": OFF,
    "promise/catch-or-return": OFF,
    "promise/param-names": OFF,
    "react/no-unstable-nested-components": OFF,
    "react-hooks/rules-of-hooks": OFF, // OMG ENABLE THIS SOON
    "no-empty": OFF,
    "regexp/match-any": OFF,
    "relay/unused-fields": OFF, // could be a warning
    "regexp/no-empty-alternative": OFF,
    "regexp/confusing-quantifier": OFF,
    "relay/generated-flow-types": OFF, // this plugin is being weird and its not seeing the types correctly
    "relay/must-colocate-fragment-spreads": OFF, // should be an error
    "relay/no-future-added-value": OFF, // warning?
    "regexp/no-dupe-characters-character-class": OFF,
    "regexp/strict": OFF,
    "regexp/optimal-quantifier-concatenation": OFF,
    "regexp/no-useless-non-capturing-group": OFF,
    "regexp/no-useless-escape": OFF,
    "regexp/no-unused-capturing-group": OFF,
  },
}
