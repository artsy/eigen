import { screen } from "@testing-library/react-native"
import { AnimatedBottomButton } from "app/Components/AnimatedBottomButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("AnimatedBottomButton", () => {
  it("renders without crashing", () => {
    renderWithWrappers(
      <AnimatedBottomButton isVisible>
        <Text>Button Text</Text>
      </AnimatedBottomButton>
    )

    expect(screen.getByText("Button Text")).toBeTruthy()
  })

  it("renders correctly when isVisible is false", () => {
    renderWithWrappers(
      <AnimatedBottomButton isVisible={false}>
        <Text>Hidden Button</Text>
      </AnimatedBottomButton>
    )

    expect(screen.queryByText("Button Text")).not.toBeTruthy()
  })
})
