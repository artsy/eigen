module.exports = {
  "no-palette-icon-imports": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow importing Icon components from @artsy/palette-mobile",
      },
      messages: {
        useIconsInstead:
          "Do not import '{{name}}' from @artsy/palette-mobile. Import it from @artsy/icons instead.",
      },
      schema: [],
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          if (node.source.value === "@artsy/palette-mobile") {
            for (const specifier of node.specifiers) {
              if (
                specifier.type === "ImportSpecifier" &&
                specifier.imported.name.endsWith("Icon")
              ) {
                context.report({
                  node: specifier,
                  messageId: "useIconsInstead",
                  data: { name: specifier.imported.name },
                })
              }
            }
          }
        },
      }
    },
  },
}
