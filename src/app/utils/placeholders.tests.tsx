import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { PlaceholderBox, PlaceholderRaggedText, ProvidePlaceholderContext } from "./placeholders"

describe(PlaceholderBox, () => {
  it(`requires a placeholder context`, () => {
    try {
      renderWithWrappers(<PlaceholderBox width={400} />)
    } catch (error: any) {
      expect(error.message).toContain(
        "Error: You're using a Placeholder outside of a PlaceholderContext"
      )
    }

    renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderBox width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe(PlaceholderRaggedText, () => {
  it(`creates the right number of placeholders matching the given number of lines`, () => {
    const tree = renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(tree.root.findAllByType(PlaceholderBox)).toHaveLength(4)
  })
})
