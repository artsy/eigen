// @ts-check

const Lint = require("tslint")
const tsutils = require("tsutils")
const ts = require("typescript")

const AUTOFIX = false

const FAILURE_STRING =
  "Please use renderWithWrappers() rather than ReactTestRenderer.create() 🙏\n(Feel free to ping the MX team for questions or feedback about this rule.)"

class Rule extends Lint.Rules.AbstractRule {
  /**
   * @type {Lint.IRuleMetadata}
   */
  metadata = {
    ruleName: "use-wrapped-components",
    type: "maintainability",
    description:
      "In the app we wrap all our pages to make functionality accessible to subcomponents. We provide a helper function to do the same in our tests.",
    descriptionDetails:
      "TBD",
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
function isIncorrectComponentCreate(node) {
  if (tsutils.isCallExpression(node)) {
    const trimmedNodeText = node.expression.getFullText().trim()
    const containsText = (trimmedNodeText === "ReactTestRenderer.create" || trimmedNodeText === "renderer.create")
    return containsText
  }
  return false
}

/**
 * @param {Lint.WalkContext<void>} ctx
 */
function walk(ctx) {
  /**
   * @param {ts.Node} node
   */
  function cb(node) {
    if (
      isIncorrectComponentCreate(node)
    ) {
      ctx.addFailureAt(
        node.getStart(),
        node.getWidth(),
        FAILURE_STRING
      )
      return
    }
    return ts.forEachChild(node, cb)
  }
  return ts.forEachChild(ctx.sourceFile, cb)
}
