import React from "react"
import ReactTestRenderer from "react-test-renderer"
import { Placeholder, ProvidePlaceholderContext, RaggedText } from "../placeholders"

describe(Placeholder, () => {
  it(`requires a placeholder context`, async () => {
    expect(() => {
      ReactTestRenderer.create(<Placeholder width={400} />)
    }).toThrowErrorMatchingInlineSnapshot(`"You're using a Placeholder outside of a PlaceholderContext"`)

    ReactTestRenderer.create(
      <ProvidePlaceholderContext>
        <Placeholder width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe(RaggedText, () => {
  it(`creates the right number of placeholders matching the given number of lines`, () => {
    const tree = ReactTestRenderer.create(
      <ProvidePlaceholderContext>
        <RaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(tree.root.findAllByType(Placeholder)).toHaveLength(4)
  })
})
