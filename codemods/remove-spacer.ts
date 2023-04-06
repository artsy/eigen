//
// Run with:
// jscodeshift --parser=tsx -t codemods/remove-spacer.ts src/**/*
//
// Afterwards:
// yarn lint:all; yarn prettier-project

import { Transform } from "jscodeshift"

const toRemove = "SimpleMessage"

const transform: Transform = (file, { jscodeshift: j }, options) => {
  const source = j(file.source)

  const oldPaletteImports = source.find(j.ImportDeclaration, {
    source: { value: "palette" },
  })

  // add import from new palette
  oldPaletteImports
    .filter((path) => path.node.specifiers?.find((s) => s.local?.name === toRemove))
    .insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier(toRemove))],
        j.literal("@artsy/palette-mobile")
      )
    )

  // remove import from old palette
  oldPaletteImports
    .find(j.ImportSpecifier, {
      imported: { name: toRemove },
    })
    .remove()

  // remove empty imports
  oldPaletteImports.filter((path) => path.node.specifiers.length === 0).remove()

  return source.toSource(options.printOptions)
}
export default transform
