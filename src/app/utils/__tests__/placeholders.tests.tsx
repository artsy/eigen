import { screen } from "@testing-library/react-native"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PlaceholderBox", () => {
  it("requires a placeholder context", async () => {
    try {
      await renderWithWrappers(<PlaceholderBox width={400} />)
    } catch (error: any) {
      expect(error.message).toContain(
        "Error: You're using a Placeholder outside of a PlaceholderContext"
      )
    }

    await renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderBox width={400} />
      </ProvidePlaceholderContext>
    )
  })
})

describe("PlaceholderRaggedText", () => {
  it("creates the right number of placeholders matching the given number of lines", async () => {
    await renderWithWrappers(
      <ProvidePlaceholderContext>
        <PlaceholderRaggedText numLines={4} />
      </ProvidePlaceholderContext>
    )

    expect(screen.getAllByTestId("placeholder-ragged-text-line")).toHaveLength(4)
  })
})
