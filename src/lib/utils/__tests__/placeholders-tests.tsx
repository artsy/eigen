import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { PlaceholderBox, PlaceholderRaggedText, ProvidePlaceholderContext } from "../placeholders"

describe(PlaceholderBox, () => {
  it(`requires a placeholder context`, async () => {
    expect(() => {
      ReactTestRenderer.create(<PlaceholderBox width={400} />)
    }).toThrowErrorMatchingInlineSnapshot(`"You're using a Placeholder outside of a PlaceholderContext"`)

    ReactTestRenderer.create(
      <ProvidePlaceholderContext>
        <PlaceholderBox width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe(PlaceholderRaggedText, () => {
  it(`creates the right number of placeholders matching the given number of lines`, () => {
    const tree = ReactTestRenderer.create(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(tree.root.findAllByType(PlaceholderBox)).toHaveLength(4)
  })
})
