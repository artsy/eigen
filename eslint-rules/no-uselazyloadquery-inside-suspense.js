// yarn upgrade eslint-plugin-artsy in order to refresh the rule
// restart eslint server

const { ESLintUtils } = require("@typescript-eslint/utils")

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/artsy/eigen/blob/main/eslint-rules/${name}.js`
)

module.exports = createRule({
  name: "no-uselazyloadquery-inside-suspense",
  meta: {
    type: "problem",
    hasSuggestions: true,
    docs: {
      description:
        "In jsx, something like `{someString && <View />}` could produce the empty string (`\"\"`) which is falsy but still produces a value, and that make React Native crash, because it doesn't know how to handle a string that's not inside a `Text`.",
      recommended: "error",
    },
    messages: {
      noUseLazyLoadQueryInsideSuspenseError:
        "Do not use useLazyLoadQuery inside a component that has a Suspense component inside, it will cause a crash.",
    },
    schema: [],
  },
  defaultOptions: [],

  create: (context) => {
    return {
      CallExpression: (node) => {
        if (node.callee.name !== "useLazyLoadQuery") {
          return
        }

        let parent = node.parent
        while (parent) {
          if (parent.type === "BlockStatement") {
            break
          }
          parent = parent.parent
        }

        const body = parent.body

        const returnStatement = body.find((node) => node.type === "ReturnStatement")

        if (returnStatement.argument.type !== "JSXElement") {
          return
        }

        const jsxElement = returnStatement.argument

        if (!amIsuspenseOrMyChildrenAreSuspense(jsxElement)) {
          return
        }

        context.report({
          node: returnStatement,
          messageId: "noUseLazyLoadQueryInsideSuspenseError",
        })
      },
    }
  },
})

const amIsuspenseOrMyChildrenAreSuspense = (node) => {
  let result = node.type === "JSXElement" && node.openingElement.name.name === "Suspense"

  if (!isSuspense) {
    for (const child of jsxElement.children) {
      result = result || amIsuspenseOrMyChildrenAreSuspense(child)
    }
  }

  return result
}
