// @ts-check

const Lint = require("tslint")
const tsutils = require("tsutils")
const ts = require("typescript")

const FAILURE_STRING = "&& in JSX forbidden"
class Rule extends Lint.Rules.AbstractRule {
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
    node.getFullText().match(/^(\!|Boolean\()/) ||
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
      !isBooleanExpression(node.left)
    ) {
      ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING)
    }

    return ts.forEachChild(node, cb)
  }

  return ts.forEachChild(ctx.sourceFile, cb)
}
