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
        "When we use useLazyLoadQuery inside a component that has <Suspense /> in react-native it causes a crash, this rule is for preventing that",
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

        if (
          returnStatement.argument.type !== "JSXElement" &&
          returnStatement.argument.type !== "JSXFragment"
        ) {
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

  if (!result && node.type === "JSXFragment") {
    for (const child of node.children) {
      result = result || amIsuspenseOrMyChildrenAreSuspense(child)
    }
  }

  if (!result) {
    for (const child of node.children || []) {
      result = result || amIsuspenseOrMyChildrenAreSuspense(child)
    }
  }

  return result
}
