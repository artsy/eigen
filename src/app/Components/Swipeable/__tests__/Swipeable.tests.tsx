import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { Swipeable } from "app/Components/Swipeable/Swipeable"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"

jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () =>
  require("app/utils/tests/mockReanimatedSwipeable")
)

jest.mock("react-native-haptic-feedback", () => ({
  trigger: jest.fn(),
}))

describe("Swipeable Component", () => {
  const mockAction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render without crashing", async () => {
    await renderWithWrappers(
      <Swipeable {...mockProps} actionComponentWidth={80} actionOnPress={mockAction} />
    )

    expect(screen.getByTestId("swipeable-component")).toBeOnTheScreen()
  })

  it("should call the action when the action component is pressed", async () => {
    await renderWithWrappers(
      <Swipeable {...mockProps} actionComponentWidth={80} actionOnPress={mockAction} />
    )

    await fireEvent.press(screen.getByText("Swipe Me"))

    expect(mockAction).toHaveBeenCalled()
  })

  it("should trigger haptic feedback when the action is pressed", async () => {
    await renderWithWrappers(
      <Swipeable {...mockProps} actionComponentWidth={80} actionOnPress={mockAction} />
    )

    await fireEvent.press(screen.getByText("Swipe Me"))

    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith("impactLight")
  })
})

const mockProps = {
  actionComponent: <Text>Swipe Me</Text>,
  children: <Text>Swipeable Component</Text>,
}
