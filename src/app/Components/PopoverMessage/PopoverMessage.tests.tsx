import { Touchable } from "@artsy/palette-mobile"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { act } from "react-test-renderer"
import { AnimatedFlex, PopoverMessage, PopoverMessageItem } from "./PopoverMessage"
import { usePopoverMessage } from "./popoverMessageHooks"

const TestRenderer: React.FC<{ options: PopoverMessageItem }> = (props) => {
  const popoverMessage = usePopoverMessage()

  return (
    <Touchable accessibilityRole="button" onPress={() => popoverMessage.show(props.options)}>
      <Text>Some button text</Text>
    </Touchable>
  )
}

describe("PopoverMessage", () => {
  it("renders when `show` is called", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(0)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(1)
  })

  it("renders 1 popover message when `show` is called twice", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(0)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(1)
  })

  it("renders with title and message", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    const popoverMessageInstance = tree.root.findByType(PopoverMessage)
    const textInstances = popoverMessageInstance.findAllByType(Text)

    expect(textInstances[0].props.children).toEqual("Some title")
    expect(textInstances[1].props.children).toEqual("Some message")
  })

  it("renders at the top", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    const popoverMessageInstance = tree.root.findByType(AnimatedFlex)

    expect(popoverMessageInstance.props.bottom).toBeUndefined()
    expect(popoverMessageInstance.props.top).not.toBeUndefined()
  })

  it("renders at the bottom", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "bottom",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    const popoverMessageInstance = tree.root.findByType(AnimatedFlex)

    expect(popoverMessageInstance.props.top).toBeUndefined()
    expect(popoverMessageInstance.props.bottom).not.toBeUndefined()
  })

  it("does not hide after timeout if autoHide is set to false", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          autoHide: false,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(1)

    jest.advanceTimersByTime(5000)

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(1)
  })

  it("should hide after `hideTimeout` time", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          hideTimeout: 5000,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    jest.advanceTimersByTime(3500)
    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(1)

    jest.advanceTimersByTime(2000)
    jest.useRealTimers()

    await flushPromiseQueue()

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(0)
  })

  it("hides when `undo` button is pressed", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          onUndoPress: jest.fn(),
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => tree.root.findByType(PopoverMessage).findByType(Touchable).props.onPress())

    jest.useRealTimers()
    await flushPromiseQueue()

    expect(tree.root.findAllByType(PopoverMessage)).toHaveLength(0)
  })

  it("should call `onUndoPress` handler when `close` button is pressed", async () => {
    const onUndoMock = jest.fn()
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          onUndoPress: onUndoMock,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => tree.root.findByType(PopoverMessage).findByType(Touchable).props.onPress())

    expect(onUndoMock).toBeCalled()
  })

  it("should hide `undo` button when `onUndoPress` is not passed", async () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findByType(PopoverMessage).findAllByType(Touchable)).toHaveLength(0)
  })

  it("should call `onPress` handler when popover message is pressed", async () => {
    const onPress = jest.fn()
    const tree = renderWithWrappersLEGACY(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          onPress,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => tree.root.findByType(PopoverMessage).findByType(Touchable).props.onPress())

    expect(onPress).toHaveBeenCalled()
  })
})
