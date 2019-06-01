/**
 * Iterates over code looking for instances where we're creating a test renderer
 * instance and wraps the contents with a palette <Theme>.
 *
 *   To run:
 *   $ yarn codemod --dry --plugin ./scripts/update-tests-with-theme.js <filename>
 *
 * @example
 *
 * // Before
 * const renderer.create(<Box color="black60" />)
 * // After
 * const renderer.create(<Theme><Box color="black60" /></Theme>)
 */

export default function({ types: t, template }) {
  const paletteThemeImport = template(`import { Theme } from "@artsy/palette"`, {
    sourceType: "module",
  })

  return {
    visitor: {
      JSXElement(path) {
        const { callee } = path.parent

        if (!t.isMemberExpression(callee)) {
          return
        }

        // When JSX is found, look backwards and determine if we're executing it via
        // a `renderer.create()` function call
        if (callee.object.name === "renderer") {
          if (callee.property.name === "create") {
            const children = t.cloneNode(path.node)

            // Create a new <Theme> element
            const id = t.jSXIdentifier("Theme")
            const opening = t.jSXOpeningElement(id, [], false)
            const closing = t.jSXClosingElement(id)
            const element = t.jSXElement(opening, closing, [children], true)

            // Insert <Theme> wrapper around contents
            path.container[0] = element

            // Import Palette's theme component
            const programPath = path.getAncestry().pop()
            const imports = programPath.get("body").filter(p => p.isImportDeclaration())
            const lastImport = imports.pop()

            if (lastImport) {
              const isPaletteImport = lastImport.node.source.value === "@artsy/palette"

              if (!isPaletteImport) {
                lastImport.insertAfter(paletteThemeImport())
              }
            }
          }
        }
      },
    },
  }
}
