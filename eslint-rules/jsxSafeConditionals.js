const {
  ESLintUtils,
  TSESTree,
  AST_TOKEN_TYPES,
  AST_NODE_TYPES,
} = require("@typescript-eslint/utils")
const { getConstrainedTypeAtLocation } = require("@typescript-eslint/type-utils")
const tsutils = require("tsutils")

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/artsy/eigen/blob/main/eslint-rules/${name}.js`
)

module.exports = createRule({
  name: "jsx-safe-conditionals",
  meta: {
    type: "problem",
    hasSuggestions: true,
    docs: {
      description:
        "In jsx, something like `{someString && <View />}` could produce the empty string (`\"\"`) which is falsy but still produces a value, and that make React Native crash, because it doesn't know how to handle a string that's not inside a `Text`.",
      recommended: "error",
      requiresTypeChecking: true,
    },
    messages: {
      jsxSafeConditionalsError: "Use `!!` to cast to booleannnnn",
    },
    schema: [],
  },
  defaultOptions: [],

  create: (context) => {
    const parserServices = ESLintUtils.getParserServices(context)
    const typeChecker = parserServices.program.getTypeChecker()

    return {
      LogicalExpression: (node) => {
        if (node.operator !== "&&") return

        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node.left)
        const type = getConstrainedTypeAtLocation(typeChecker, tsNode)
        const types = tsutils.unionTypeParts(type)

        console.log({ type, types })

        context.report({
          node: node.left,
          messageId: "jsxSafeConditionalsError",
        })
      },
    }
  },

  // if (
  //   isJsxContext(node) &&
  //   !isBooleanExpression(node.left) &&
  //   !isWithinBooleanExpression(node) &&
  //   !isOnLeftHandOfConditionalExpression(node) &&
  //   !isInStatementCondition(node)
  // ) {
  //   ctx.addFailureAt(
  //     node.getStart(),
  //     node.left.getWidth(),
  //     FAILURE_STRING,
  //     AUTOFIX
  //       ? new Lint.Replacement(
  //           node.left.getStart(),
  //           node.left.getWidth(),
  //           isBinaryExpression(node.left) ? `!!(${node.left.getFullText()})` : `!!${node.left.getFullText()}`
  //         )
  //       : undefined
  //   )
  //   return

  // BinaryExpression: (node) => {
  //   if (
  //     node.operator === "&&" &&
  //     !isBooleanExpression(node.left) &&
  //     !isWithinBooleanExpression(node) &&
  //     !isOnLeftHandOfConditionalExpression(node) &&
  //     !isInStatementCondition(node)
  //   ) {
  //     context.report({
  //       node: node.left,
  //       message: FAILURE_STRING,
  //       fix: AUTOFIX
  //         ? function (fixer) {
  //             return fixer.replaceText(
  //               node.left,
  //               isBinaryExpression(node.left)
  //                 ? `!!(${node.left.getFullText()})`
  //                 : `!!${node.left.getFullText()}`
  //             )
  //           }
  //         : null,
  //     })
  //   }
  // },
})

// to test this,
// yarn install --force
// yarn lint src/app/App.tsx
