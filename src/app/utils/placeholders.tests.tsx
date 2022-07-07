import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { PlaceholderBox, PlaceholderRaggedText, ProvidePlaceholderContext } from "./placeholders"

describe(PlaceholderBox, () => {
  it(`requires a placeholder context`, () => {
    try {
      renderWithWrappersLEGACY(<PlaceholderBox width={400} />)
    } catch (error: any) {
      expect(error.message).toContain(
        "Error: You're using a Placeholder outside of a PlaceholderContext"
      )
    }

    renderWithWrappersLEGACY(
      <ProvidePlaceholderContext>
        <PlaceholderBox width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe(PlaceholderRaggedText, () => {
  it(`creates the right number of placeholders matching the given number of lines`, () => {
    const tree = renderWithWrappersLEGACY(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(tree.root.findAllByType(PlaceholderBox)).toHaveLength(4)
  })
})
