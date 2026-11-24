import { Touchable } from "@artsy/palette-mobile"
import { act, fireEvent, screen } from "@testing-library/react-native"
import { TOAST_DURATION_MAP } from "app/Components/Toast/ToastComponent"
import { useToast } from "app/Components/Toast/toastHook"
import { ToastOptions, ToastPlacement } from "app/Components/Toast/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

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
    await renderWithWrappers(<TestRenderer />)

    expect(screen.queryByText("Consider yourself toasted!")).not.toBeOnTheScreen()

    const button = screen.getByText("Some button text")
    await fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
  })

  it("renders a toast with the description when provided", async () => {
    await renderWithWrappers(
      <TestRenderer placement="bottom" toastOptions={{ description: "TOASTED!" }} />
    )
    expect(screen.queryByText("Consider yourself toasted!")).not.toBeOnTheScreen()

    const button = screen.getByText("Some button text")
    await fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
    expect(screen.getByText("TOASTED!")).toBeOnTheScreen()
  })

  it("Does not clear Toast before duration is reached", async () => {
    const duration = "short"
    await renderWithWrappers(<TestRenderer toastOptions={{ duration }} />)

    const button = screen.getByText("Some button text")
    await fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
    await act(() => {
      jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] - 1000)
    })

    // expects the toast to still be on the screen
    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()
  })

  it("Clears Toast when the duration is reached", async () => {
    const duration = "short"
    await renderWithWrappers(<TestRenderer toastOptions={{ duration }} />)

    const button = screen.getByText("Some button text")

    await fireEvent.press(button)

    expect(screen.getByText("Consider yourself toasted!")).toBeOnTheScreen()

    const ANIMATION_DURATION = 500
    await act(() => jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] + ANIMATION_DURATION))

    expect(screen.queryByText("Consider yourself toasted!")).not.toBeOnTheScreen()
  })
})
