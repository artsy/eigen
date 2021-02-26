import { renderWithWrappers_legacy } from "lib/tests/renderWithWrappers"
import React from "react"
import { PlaceholderBox, PlaceholderRaggedText, ProvidePlaceholderContext } from "../placeholders"

describe(PlaceholderBox, () => {
  it(`requires a placeholder context`, () => {
    try {
      renderWithWrappers_legacy(<PlaceholderBox width={400} />)
    } catch (error) {
      expect(error.message).toContain("Error: You're using a Placeholder outside of a PlaceholderContext")
    }

    renderWithWrappers_legacy(
      <ProvidePlaceholderContext>
        <PlaceholderBox width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe(PlaceholderRaggedText, () => {
  it(`creates the right number of placeholders matching the given number of lines`, () => {
    const tree = renderWithWrappers_legacy(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(tree.root.findAllByType(PlaceholderBox)).toHaveLength(4)
  })
})
