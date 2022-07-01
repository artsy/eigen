const OFF = 0
const WARN = 1
const ERR = 2

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:relay/recommended",
    "plugin:react/recommended",
    "plugin:promise/recommended",
    "@react-native-community", // https://github.com/facebook/react-native/tree/HEAD/packages/eslint-config-react-native-community
    "plugin:react-native-a11y/ios",
    "plugin:regexp/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // keep this last
  ],
  plugins: [
    "@typescript-eslint",
    // react, react-hooks, react-native, jest, eslint-comments: these come from the @react-native-community extension
    "relay",
    "promise",
    "no-loops",
    "regexp",
    "import",
  ],

  settings: {
    "import/parsers": { "@typescript-eslint/parser": [".tsx", ".ts"] },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: "<root>/tsconfig.json",
      },
    },
  },

  rules: {
    "sort-imports": OFF, // no need for this, we use `import/order` instead
    // "import/order": [
    //   ERR,
    //   {
    //     groups: ["builtin", "external", "internal", "parent", "sibling"],
    //     alphabetize: { order: "asc" },
    //   },
    // ],

    ////////////////////////////////////////
    //// DONT ADD MORE STUFF BELOW HERE ////
    ////  ! THESE ARE JUST TEMPORARY !  ////
    ////////////////////////////////////////
    // enable some later. check these below at some point. we removed them to match our old tslint without break everything.
    // if we keep them off, then add a comment for the reason why its off
    "import/order": OFF, // we have a ready rule above. use that.
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
    "@typescript-eslint/no-non-null-asserted-optional-chain": OFF, // should be an error?
    "@typescript-eslint/no-unused-vars": OFF, // could be a warning
    "@typescript-eslint/no-var-requires": OFF, // could be a warning
    "@typescript-eslint/prefer-ts-expect-error": OFF, // should be an error
    "import/no-duplicates": OFF,
    "import/no-named-as-default": OFF,
    "import/no-named-as-default-member": OFF,
    "import/default": OFF,
    "import/no-unresolved": OFF,
    "no-constant-condition": OFF,
    "no-control-regex": OFF,
    "no-empty": OFF,
    "no-extra-boolean-cast": OFF, // debatable
    "promise/always-return": OFF,
    "promise/catch-or-return": OFF,
    "promise/param-names": OFF,
    "react-hooks/exhaustive-deps": OFF,
    "react-hooks/rules-of-hooks": OFF, // OMG ENABLE THIS SOON
    "react-native-a11y/has-accessibility-hint": OFF,
    "react-native-a11y/has-valid-accessibility-descriptors": OFF,
    "react-native-a11y/has-valid-accessibility-ignores-invert-colors": OFF,
    "react-native-a11y/no-nested-touchables": OFF,
    "react-native/no-inline-styles": OFF,
    "react/no-unstable-nested-components": OFF,
    "react/react-in-jsx-scope": OFF,
    "regexp/confusing-quantifier": OFF,
    "regexp/match-any": OFF,
    "regexp/no-dupe-characters-character-class": OFF,
    "regexp/no-empty-alternative": OFF,
    "regexp/no-unused-capturing-group": OFF,
    "regexp/no-useless-escape": OFF,
    "regexp/no-useless-flag": OFF,
    "regexp/no-useless-non-capturing-group": OFF,
    "regexp/optimal-quantifier-concatenation": OFF,
    "regexp/strict": OFF,
    "relay/generated-flow-types": OFF, // this plugin is being weird and its not seeing the types correctly
    "relay/must-colocate-fragment-spreads": OFF, // should be an error
    "relay/no-future-added-value": OFF, // warning?
    "relay/unused-fields": OFF, // could be a warning
  },
}
