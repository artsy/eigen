// @ts-nocheck
//
// Install the apollo-language-server package to get typings for the configuration object when needing to make updates.
// It seems overkill to install the package and all its dependencies for the occasional updates made here.

const validationRulesToExcludeForRelay = ["NoUndefinedVariables"]

/**
 * @type {import("apollo-language-server/lib/config").ApolloConfigFormat}
 */
const config = {
  client: {
    service: {
      name: "local",
      localSchemaFile: "data/schema.graphql",
    },
    validationRules: rule => !validationRulesToExcludeForRelay.includes(rule.name),
    includes: ["src/**/*.{ts,tsx,graphql}"],
    excludes: ["**/node_modules", "**/__tests__"],
    tagName: "graphql",
  },
}

module.exports = config
