import { screen } from "@testing-library/react-native"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PlaceholderBox", () => {
  it("requires a placeholder context", () => {
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

describe("PlaceholderRaggedText", () => {
  it("creates the right number of placeholders matching the given number of lines", () => {
    renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(screen.UNSAFE_queryAllByType(PlaceholderBox)).toHaveLength(4)
  })
})
