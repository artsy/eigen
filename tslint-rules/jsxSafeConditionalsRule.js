// @ts-check

const Lint = require("tslint")
const tsutils = require("tsutils")
const ts = require("typescript")
const { isBinaryExpression } = require("typescript")

const AUTOFIX = false

const FAILURE_STRING =
  "Please use safe conditional expressions in JSX 🙏\nYou could add `!!` in front.\n(Feel free to ping the MX team for questions or feedback about this rule.)"

class Rule extends Lint.Rules.AbstractRule {
  /**
   * @type {Lint.IRuleMetadata}
   */
  metadata = {
    ruleName: "jsx-safe-conditionals",
    type: "maintainability",
    description:
      "React Native doesn't handle strings that are not wrapped in a `Text` tag in jsx, so we should not allow any case where that might happen.",
    descriptionDetails:
      "In jsx, something like `{someString && <View />}` could produce the empty string (`\"\"`) which is falsy but still produces a value, and that make React Native crash, because it doesn't know how to handle a string that's not inside a `Text`.",
    hasFix: AUTOFIX,
    optionsDescription: "No options",
    options: {},
    typescriptOnly: false,
  }

  /**
   * @param {ts.SourceFile} sourceFile
   * @returns {Lint.RuleFailure[]}
   */
  apply(sourceFile) {
    return this.applyWithFunction(sourceFile, walk)
  }
}
module.exports.Rule = Rule

/**
 * @param {ts.Node} node
 */
function isJsxContext(node) {
  if (tsutils.isJsxAttribute(node)) {
    return false
  } else if (tsutils.isJsxElement(node)) {
    return true
  } else {
    if (node.parent) {
      return isJsxContext(node.parent)
    }
  }
}

/**
 * @param {ts.Node} node
 */
function isBooleanExpression(node) {
  return (
    (tsutils.isParenthesizedExpression(node) && isBooleanExpression(node.expression)) ||
    (tsutils.isPrefixUnaryExpression(node) && node.operator == ts.SyntaxKind.ExclamationToken) ||
    (tsutils.isCallExpression(node) && node.expression.getFullText() === "Boolean") ||
    (tsutils.isBinaryExpression(node) &&
      ([
        ts.SyntaxKind.GreaterThanEqualsToken,
        ts.SyntaxKind.GreaterThanToken,
        ts.SyntaxKind.LessThanEqualsToken,
        ts.SyntaxKind.LessThanToken,
        ts.SyntaxKind.EqualsEqualsEqualsToken,
        ts.SyntaxKind.EqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsToken,
      ].includes(node.operatorToken.kind) ||
        (isBooleanExpression(node.left) && isBooleanExpression(node.right))))
  )
}

/**
 * @param {ts.Node} node
 */
function isWithinBooleanExpression(node) {
  if (node.parent) {
    if (isBooleanExpression(node.parent)) {
      return true
    }
    return isWithinBooleanExpression(node.parent)
  }
  return false
}

/**
 * @param {ts.Node} node
 */
function isOnLeftHandOfConditionalExpression(node) {
  if (node.parent) {
    if (tsutils.isConditionalExpression(node.parent) && node.parent.condition === node) {
      return true
    }
    return isOnLeftHandOfConditionalExpression(node.parent)
  }
  return false
}

/**
 * @param {ts.Node} node
 */
function isInStatementCondition(node) {
  if (node.parent) {
    if (
      (tsutils.isIfStatement(node.parent) || tsutils.isWhileStatement(node.parent)) &&
      node.parent.expression === node
    ) {
      return true
    }
    return isOnLeftHandOfConditionalExpression(node.parent)
  }
  return false
}

/**
 *
 * @param {Lint.WalkContext<void>} ctx
 */
function walk(ctx) {
  /**
   * @param {ts.Node} node
   */
  function cb(node) {
    if (
      tsutils.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
      isJsxContext(node) &&
      !isBooleanExpression(node.left) &&
      !isWithinBooleanExpression(node) &&
      !isOnLeftHandOfConditionalExpression(node) &&
      !isInStatementCondition(node)
    ) {
      ctx.addFailureAt(
        node.getStart(),
        node.left.getWidth(),
        FAILURE_STRING,
        AUTOFIX
          ? new Lint.Replacement(
              node.left.getStart(),
              node.left.getWidth(),
              isBinaryExpression(node.left) ? `!!(${node.left.getFullText()})` : `!!${node.left.getFullText()}`
            )
          : undefined
      )
      return
    }

    return ts.forEachChild(node, cb)
  }

  return ts.forEachChild(ctx.sourceFile, cb)
}
