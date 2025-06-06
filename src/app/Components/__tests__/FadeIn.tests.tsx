import { screen } from "@testing-library/react-native"
import { FadeIn } from "app/Components/FadeIn"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("FadeIn", () => {
  it("renders children correctly", () => {
    renderWithWrappers(
      <FadeIn>
        <Text>Test Content</Text>
      </FadeIn>
    )

    expect(screen.getByText("Test Content")).toBeTruthy()
  })
})
