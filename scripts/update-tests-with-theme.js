/**
 * Iterates over code looking for instances where we're creating a test renderer
 * instance and updates the contents with a reference to a palette <Theme>.
 *
 * To run:
 *  $ yarn codemod --dry --plugin ./scripts/update-tests-with-theme.js <filename>
 */
export default function({ types: t, template }) {
  const paletteThemeImport = template(`import { Theme } from "@artsy/palette"`, { sourceType: "module" })

  return {
    visitor: {
      JSXElement(path, state) {
        const { callee } = path.parent
        if (t.isMemberExpression(callee)) {
          if (callee.object.name === "renderer") {
            if (callee.property.name === "create") {
              const children = t.cloneNode(path.node)
              const id = t.jSXIdentifier("Theme")
              const opening = t.jSXOpeningElement(id, [], false)
              const closing = t.jSXClosingElement(id)
              const element = t.jSXElement(opening, closing, [children], true)

              // Add `<Theme>...</Theme>` wrapper
              path.container[0] = element

              // Add `import { Theme } from '@artsy/palette'` to file
              const programPath = path.getAncestry().pop()
              const imports = programPath.get("body").filter(p => p.isImportDeclaration())
              const lastImport = imports.pop()
              const isPaletteImport = lastImport.node.source.value === "@artsy/palette"

              if (lastImport && !isPaletteImport) {
                lastImport.insertAfter(paletteThemeImport())
              }
            }
          }
        }
      },
    },
  }
}
