import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import { Text } from "react-native"
import { act } from "react-test-renderer"
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
    const tree = renderWithWrappers(<TestRenderer />)

    expect(tree.root.findAllByType(ToastComponent)).toHaveLength(0)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(ToastComponent)).toHaveLength(1)
  })

  it("Does Not clear Toast before duration is reached", () => {
    const duration = "short"
    const tree = renderWithWrappers(<TestRenderer toastOptions={{ duration }} />)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(ToastComponent)).toHaveLength(1)
    jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] - 1000)

    expect(tree.root.findAllByType(ToastComponent)).not.toHaveLength(0)
  })

  it("Clears Toast when the duration is reached", () => {
    const duration = "short"
    const tree = renderWithWrappers(<TestRenderer toastOptions={{ duration }} />)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(ToastComponent)).toHaveLength(1)

    const ANIMATION_DURATION = 500
    jest.advanceTimersByTime(TOAST_DURATION_MAP[duration] + ANIMATION_DURATION)

    expect(tree.root.findAllByType(ToastComponent)).toHaveLength(0)
  })
})
