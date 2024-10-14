import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Swipeable Component", () => {
  const mockAction = jest.fn()

  it("should render without crashing", () => {
    renderWithWrappers(
      <Swipeable {...mockProps} actionComponentWidth={80} actionOnPress={mockAction} />
    )

    expect(screen.getByTestId("swipeable-component")).toBeOnTheScreen()
  })

  it("should call the action when the action component is pressed", () => {
    renderWithWrappers(
      <Swipeable {...mockProps} actionComponentWidth={80} actionOnPress={mockAction} />
    )

    fireEvent.press(screen.getByText("Swipe Me"))

    expect(mockAction).toHaveBeenCalled()
  })
})

const mockProps = {
  actionComponent: <Text>Swipe Me</Text>,
  children: <Text>Swipeable Component</Text>,
}
