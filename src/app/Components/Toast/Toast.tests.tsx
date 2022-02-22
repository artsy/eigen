import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import { Text } from "react-native"
import { act } from "react-test-renderer"
import { ToastComponent } from "./ToastComponent"
import { useToast } from "./toastHook"

const TestRenderer: React.FC = () => {
  const toast = useToast()

  return (
    <Touchable onPress={() => toast.show("Consider yourself toasted!", "middle")}>
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

    jest.advanceTimersByTime(3000)

    expect(tree.root.findAllByType(ToastComponent)).toHaveLength(0)
  })
})
