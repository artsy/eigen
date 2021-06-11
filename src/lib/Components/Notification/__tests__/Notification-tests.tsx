import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Touchable } from "palette"
import React from "react"
import { Text } from "react-native"
import { act } from "react-test-renderer"
import { AnimatedFlex, Notification, NotificationOptions } from "../Notification"
import { useNotification } from "../notificationHooks"

const TestRenderer: React.FC<{ options: NotificationOptions }> = (props) => {
  const notification = useNotification()

  return (
    <Touchable onPress={() => notification.show(props.options)}>
      <Text>Some button text</Text>
    </Touchable>
  )
}

describe("Notification", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders when `show` is called", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
        }}
      />
    )

    expect(tree.root.findAllByType(Notification)).toHaveLength(0)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(Notification)).toHaveLength(1)

    jest.advanceTimersByTime(3500)

    expect(tree.root.findAllByType(Notification)).toHaveLength(0)
  })

  it("renders 2 notifications when `show` is called twice", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
        }}
      />
    )

    expect(tree.root.findAllByType(Notification)).toHaveLength(0)

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(Notification)).toHaveLength(2)
  })

  it("renders with title and message", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    const notificationInstance = tree.root.findByType(Notification)
    const textInstances = notificationInstance.findAllByType(Text)

    expect(textInstances[0].props.children).toEqual("Some title")
    expect(textInstances[1].props.children).toEqual("Some message")
  })

  it("renders at the top", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    const notificationInstance = tree.root.findByType(AnimatedFlex)

    expect(notificationInstance.props.bottom).toBeUndefined()
    expect(notificationInstance.props.top).not.toBeUndefined()
  })

  it("renders at the bottom", async () => {
    const tree = renderWithWrappers(
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

    const notificationInstance = tree.root.findByType(AnimatedFlex)

    expect(notificationInstance.props.top).toBeUndefined()
    expect(notificationInstance.props.bottom).not.toBeUndefined()
  })

  it("does not hide after timeout if autoHide is set to false", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "bottom",
          autoHide: false,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findAllByType(Notification)).toHaveLength(1)

    jest.advanceTimersByTime(5000)

    expect(tree.root.findAllByType(Notification)).toHaveLength(1)
  })

  it("should hide after `hideTimeout` time", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "bottom",
          hideTimeout: 5000,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    jest.advanceTimersByTime(3500)
    expect(tree.root.findAllByType(Notification)).toHaveLength(1)

    jest.advanceTimersByTime(5000)
    expect(tree.root.findAllByType(Notification)).toHaveLength(0)
  })

  it("hides when `close` button is pressed", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => tree.root.findByType(Notification).findByType(Touchable).props.onPress())

    jest.advanceTimersByTime(1000)

    expect(tree.root.findAllByType(Notification)).toHaveLength(0)
  })

  it("should call `onClose` handler when `close` button is pressed", async () => {
    const onClose = jest.fn()
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
          onClose,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => tree.root.findByType(Notification).findByType(Touchable).props.onPress())

    expect(onClose).toBeCalled()
  })

  it("should hide `close` button when `showCloseIcon` is set to false", async () => {
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
          showCloseIcon: false,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())

    expect(tree.root.findByType(Notification).findAllByType(Touchable)).toHaveLength(0)
  })

  it("should call `onPress` handler when notification is pressed", async () => {
    const onPress = jest.fn()
    const tree = renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "top",
          onPress,
        }}
      />
    )

    const buttonInstance = tree.root.findByType(Touchable)
    act(() => buttonInstance.props.onPress())
    act(() => tree.root.findByType(Notification).findByType(Touchable).props.onPress())

    expect(onPress).toHaveBeenCalled()
  })
})
