import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Touchable } from "palette"
import { Text } from "react-native"
import { TOAST_DURATION_MAP, ToastComponent } from "./ToastComponent"
import { useToast } from "./toastHook"
import { ToastOptions } from "./types"

const TestRenderer: React.FC<{ toastOptions?: ToastOptions }> = ({ toastOptions }) => {
  const toast = useToast()

  return (
    <Touchable
      onPress={() => toast.show("Consider yourself toasted!", "middle", { ...toastOptions })}
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
    const { UNSAFE_queryAllByType, UNSAFE_getByType } = renderWithWrappers(<TestRenderer />)

    expect(UNSAFE_queryAllByType(ToastComponent)).toHaveLength(0)

    const button = UNSAFE_getByType(Touchable)
    fireEvent.press(button)

    expect(UNSAFE_queryAllByType(ToastComponent)).toHaveLength(1)
  })

  it("Does not clear Toast before duration is reached", () => {
    const duration = "short"
    const { UNSAFE_queryAllByType, UNSAFE_getByType } = renderWithWrappers(
      <TestRenderer toastOptions={{ duration }} />
    )

    const button = UNSAFE_getByType(Touchable)
    fireEvent.press(button)

    expect(UNSAFE_queryAllByType(ToastComponent)).toHaveLength(1)
    jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] - 1000)

    expect(UNSAFE_queryAllByType(ToastComponent)).not.toHaveLength(0)
  })

  fit("Clears Toast when the duration is reached", () => {
    const duration = "short"
    const { UNSAFE_queryAllByType, UNSAFE_getByType } = renderWithWrappers(
      <TestRenderer toastOptions={{ duration }} />
    )

    const button = UNSAFE_getByType(Touchable)
    fireEvent.press(button)

    expect(UNSAFE_queryAllByType(ToastComponent)).toHaveLength(1)

    const ANIMATION_DURATION = 500
    jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] + ANIMATION_DURATION)

    expect(UNSAFE_queryAllByType(ToastComponent)).toHaveLength(0)
  })
})
