import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { PlaceholderBox, PlaceholderRaggedText, ProvidePlaceholderContext } from "../placeholders"

describe(PlaceholderBox, () => {
  it(`requires a placeholder context`, async () => {
    expect(() => {
      renderWithWrappers(<PlaceholderBox width={400} />)
    }).toThrowErrorMatchingInlineSnapshot(`"You're using a Placeholder outside of a PlaceholderContext"`)

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
