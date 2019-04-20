// Configuration for the vscode-apollo extension.
module.exports = {
  client: {
    service: {
      name: "local",
      localSchemaFile: "data/schema.graphql",
    },
    excludeValidationRules: [
      // Default of vscode-apollo.
      "NoUnusedFragments",
      // A default of vscode-apollo, but we also need it because of Relay’s
      // client-side directives.
      "KnownDirectives",
      // Added because Relay has ‘local’ variables (defined with the
      // `@argumentDefinitions` directive) and these don’t need to be defined on
      // the operation.
      "NoUndefinedVariables",
    ],
    includes: ["src/**/*.{ts,tsx,graphql}"],
    excludes: ["**/node_modules", "**/__tests__"],
    tagName: "graphql",
  },
}
