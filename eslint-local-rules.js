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
  "no-status-bar-style-in-navigation-options": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Disallow statusBarStyle in navigation options (screenOptions or options props)",
      },
      messages: {
        noStatusBarStyleInNavigationOptions:
          "Please do not use 'statusBarStyle' in navigation options. Using it will cause an crash in iOS with UIViewControllerBasedStatusBarAppearance, please use react-native StatusBar instead.",
      },
      schema: [],
    },
    create(context) {
      const checkForStatusBarStyle = (objectExpression) => {
        if (!objectExpression || objectExpression.type !== "ObjectExpression") {
          return
        }

        for (const property of objectExpression.properties) {
          if (
            property.type === "Property" &&
            property.key.type === "Identifier" &&
            property.key.name === "statusBarStyle"
          ) {
            context.report({
              node: property,
              messageId: "noStatusBarStyleInNavigationOptions",
            })
          }
        }
      }

      return {
        JSXElement(node) {
          const elementName = node.openingElement.name

          // Check for Stack.Navigator or StackNavigator.Navigator (screenOptions)
          const isNavigator =
            elementName.type === "JSXMemberExpression" &&
            elementName.property.type === "JSXIdentifier" &&
            elementName.property.name === "Navigator"

          // Check for Stack.Screen or StackNavigator.Screen (options)
          const isScreen =
            elementName.type === "JSXMemberExpression" &&
            elementName.property.type === "JSXIdentifier" &&
            elementName.property.name === "Screen"

          if (!isNavigator && !isScreen) {
            return
          }

          // Find the relevant prop (screenOptions for Navigator, options for Screen)
          const propName = isNavigator ? "screenOptions" : "options"
          const targetProp = node.openingElement.attributes.find(
            (attr) => attr.type === "JSXAttribute" && attr.name.name === propName
          )

          if (!targetProp || !targetProp.value) {
            return
          }

          // Handle JSXExpressionContainer (e.g., screenOptions={{...}})
          if (targetProp.value.type === "JSXExpressionContainer") {
            const expression = targetProp.value.expression
            checkForStatusBarStyle(expression, targetProp)
          }
        },
      }
    },
  },
}
