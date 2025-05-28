import { Touchable } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { TOAST_DURATION_MAP } from "./ToastComponent"
import { useToast } from "./toastHook"
import { ToastOptions, ToastPlacement } from "./types"

const TestRenderer: React.FC<{ toastOptions?: ToastOptions; placement?: ToastPlacement }> = ({
  toastOptions,
  placement = "middle",
}) => {
  const toast = useToast()

  return (
    <Touchable
      accessibilityRole="button"
      onPress={() => toast.show("Consider yourself toasted!", placement, { ...toastOptions })}
    >
      <Text>Some button text</Text>
    </Touchable>
  )
}

describe("Toast", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders a toast when show toast is called", async () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.queryByText("Consider yourself toasted!")).not.toBeOnTheScreen()

    const button = screen.getByText("Some button text")
    fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
  })

  it("renders a toast with the description when provided", async () => {
    renderWithWrappers(
      <TestRenderer placement="bottom" toastOptions={{ description: "TOASTED!" }} />
    )
    expect(screen.queryByText("Consider yourself toasted!")).not.toBeOnTheScreen()

    const button = screen.getByText("Some button text")
    fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
    expect(screen.getByText("TOASTED!")).toBeOnTheScreen()
  })

  it("Does not clear Toast before duration is reached", () => {
    const duration = "short"
    renderWithWrappers(<TestRenderer toastOptions={{ duration }} />)

    const button = screen.getByText("Some button text")
    fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
    jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] - 1000)

    // expects the toast to still be on the screen
    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
  })

  it("Clears Toast when the duration is reached", () => {
    const duration = "short"
    renderWithWrappers(<TestRenderer toastOptions={{ duration }} />)

    const button = screen.getByText("Some button text")
    fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()

    const ANIMATION_DURATION = 500
    jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] + ANIMATION_DURATION)

    expect(screen.queryByText("Consider yourself toasted!")).not.toBeOnTheScreen()
  })
})
