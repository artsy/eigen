import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button, Flex } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { Toast } from "../Toast"
import { useToast } from "../toastHook"

const TestRenderer: React.FC = () => {
  const toast = useToast()

  return (
    <Flex>
      <Button onPress={() => toast.show("Consider yourself toasted!", "middle")}>Toast me</Button>
    </Flex>
  )
}

describe("Toasts", () => {
  jest.useFakeTimers()

  it("renders a toast when", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    expect(tree.root.findAllByType(Toast)).toHaveLength(0)

    const buttonInstance = tree.root.findByType(Button)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(Toast)).toHaveLength(1)

    jest.advanceTimersByTime(3000)

    expect(tree.root.findAllByType(Toast)).toHaveLength(0)
  })
})
