module.exports = {
  "no-palette-icon-imports": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow importing Icon components from @artsy/palette-mobile",
      },
      messages: {
        useIconsInstead:
          "Do not import '{{name}}' from @artsy/palette-mobile. Import it from @artsy/icons/native instead.",
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
  "no-onpress-in-routerlink": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow onPress prop on components wrapped with RouterLink",
      },
      messages: {
        noOnPressInRouterLink:
          "Do not use onPress prop on components wrapped with RouterLink. Pass `onPress` to `RouterLink` instead and use the 'to' prop for navigation.",
      },
      schema: [],
      hasSuggestions: true,
    },
    create(context) {
      return {
        JSXElement(node) {
          // Check if this is a RouterLink element
          if (
            node.openingElement.name.type === "JSXIdentifier" &&
            node.openingElement.name.name === "RouterLink"
          ) {
            // Find child elements that have onPress prop
            const children = node.children || []
            for (const child of children) {
              if (child.type === "JSXElement") {
                const onPressProp = child.openingElement.attributes.find(
                  (attr) => attr.type === "JSXAttribute" && attr.name.name === "onPress"
                )

                if (onPressProp) {
                  context.report({
                    node: onPressProp,
                    messageId: "noOnPressInRouterLink",
                    suggest: [
                      {
                        desc: "Remove the onPress prop",
                        fix: (fixer) => {
                          return fixer.remove(onPressProp)
                        },
                      },
                    ],
                  })
                }
              }
            }
          }
        },
      }
    },
  },
}
