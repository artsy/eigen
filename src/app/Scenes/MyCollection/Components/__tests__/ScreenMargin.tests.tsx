import { Text } from "@artsy/palette-mobile"
import { screen } from "@testing-library/react-native"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Navigator", () => {
  it("renders child components", () => {
    const Noop: React.FC = () => <Text>Child content</Text>
    renderWithWrappers(
      <ScreenMargin>
        <Noop />
      </ScreenMargin>
    )
    expect(screen.getByText("Child content")).toBeOnTheScreen()
  })
})
