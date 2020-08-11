// @ts-check

const Lint = require("tslint")
const tsutils = require("tsutils")
const ts = require("typescript")

const FAILURE_STRING = "Please use renderWithWrappers() rather than ReactTestRenderer.create() 🙏\n(Feel free to ping the MX team for questions or feedback about this rule.)"

class Rule extends Lint.Rules.AbstractRule {
  /**
   * @type {Lint.IRuleMetadata}
   */
  metadata = {
    ruleName: "use-wrapped-components",
    type: "maintainability",
    description:
      "In the app we wrap all our Pages to make functionality accessible to subcomponents. We provide a helper function to do the same in our tests.",
    descriptionDetails:
      "In the app we wrap all our Pages to make functionality accessible to subcomponents. We provide a helper function to do the same in our tests. Many components implicity depend on these wrappers.",
    hasFix: false,
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
 * @param {ts.CallExpression} node
 */
function isIncorrectComponentCreate(node) {
  const trimmedNodeText = node.expression.getFullText().trim()
  const containsText = (trimmedNodeText === "ReactTestRenderer.create" || trimmedNodeText === "renderer.create")
  return containsText
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
      tsutils.isCallExpression(node) && isIncorrectComponentCreate(node)
    ) {
      // TODO: Can this be a suggestion rather than an autofix?
      // const fix = new Lint.Replacement(node.getStart(), node.expression.getFullText().trim().length, "renderWithWrappers");
      ctx.addFailureAt(
        node.getStart(),
        node.getWidth(),
        FAILURE_STRING,
      )
      return
    }
    return ts.forEachChild(node, cb)
  }
  return ts.forEachChild(ctx.sourceFile, cb)
}
