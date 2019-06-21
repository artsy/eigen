// @ts-nocheck
//
// Install the apollo-language-server package to get typings for the configuration object when needing to make updates.
// It seems overkill to install the package and all its dependencies for the occasional updates made here.

const path = require("path")

const { getLanguagePlugin } = require("relay-compiler/lib/RelayCompilerMain")
const { loadConfig } = require("relay-config")

const RelayConfig = loadConfig()
const RelayLanguagePlugin = getLanguagePlugin(RelayConfig.language || "javascript")

const ValidationRulesToExcludeForRelay = ["NoUndefinedVariables"]

/**
 * @type {import("apollo-language-server/lib/config").ApolloConfigFormat}
 */
const config = {
  client: {
    service: {
      name: "local",
      localSchemaFile: RelayConfig.schema,
    },
    validationRules: rule => !ValidationRulesToExcludeForRelay.includes(rule.name),
    includes: [path.join(RelayConfig.src, `**/*.{graphql,${RelayLanguagePlugin.inputExtensions.join(",")}}`)],
    excludes: RelayConfig.exclude,
    tagName: "graphql",
  },
}

module.exports = config
