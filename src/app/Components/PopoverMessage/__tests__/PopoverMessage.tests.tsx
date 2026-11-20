import { Touchable } from "@artsy/palette-mobile"
import { act, fireEvent, screen, within } from "@testing-library/react-native"
import { PopoverMessageItem } from "app/Components/PopoverMessage/PopoverMessage"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { StyleSheet, Text } from "react-native"

const TestRenderer: React.FC<{ options: PopoverMessageItem }> = (props) => {
  const popoverMessage = usePopoverMessage()

  return (
    <Touchable accessibilityRole="button" onPress={() => popoverMessage.show(props.options)}>
      <Text>Some button text</Text>
    </Touchable>
  )
}

const POPOVER_TEST_ID = "popover-message"

const pressShowButton = async () => {
  await fireEvent.press(screen.getByText("Some button text"))
  // let the popover's async show logic settle
  await act(async () => undefined)
}

describe("PopoverMessage", () => {
  it("renders when `show` is called", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    expect(screen.queryByTestId(POPOVER_TEST_ID)).not.toBeOnTheScreen()

    await pressShowButton()

    expect(screen.getAllByTestId(POPOVER_TEST_ID)).toHaveLength(1)
  })

  it("renders 1 popover message when `show` is called twice", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    expect(screen.queryByTestId(POPOVER_TEST_ID)).not.toBeOnTheScreen()

    await pressShowButton()
    await pressShowButton()

    expect(screen.getAllByTestId(POPOVER_TEST_ID)).toHaveLength(1)
  })

  it("renders with title and message", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    await pressShowButton()

    const popoverMessage = screen.getByTestId(POPOVER_TEST_ID)

    expect(within(popoverMessage).getByText("Some title")).toBeOnTheScreen()
    expect(within(popoverMessage).getByText("Some message")).toBeOnTheScreen()
  })

  it("renders at the top", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    await pressShowButton()

    const style = StyleSheet.flatten(screen.getByTestId(POPOVER_TEST_ID).props.style)

    expect(style.bottom).toBeUndefined()
    expect(style.top).not.toBeUndefined()
  })

  it("renders at the bottom", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          placement: "bottom",
        }}
      />
    )

    await pressShowButton()

    const style = StyleSheet.flatten(screen.getByTestId(POPOVER_TEST_ID).props.style)

    expect(style.top).toBeUndefined()
    expect(style.bottom).not.toBeUndefined()
  })

  it("does not hide after timeout if autoHide is set to false", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          autoHide: false,
        }}
      />
    )

    await pressShowButton()

    expect(screen.getAllByTestId(POPOVER_TEST_ID)).toHaveLength(1)

    jest.advanceTimersByTime(5000)

    expect(screen.getAllByTestId(POPOVER_TEST_ID)).toHaveLength(1)
  })

  it("should hide after `hideTimeout` time", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          hideTimeout: 5000,
        }}
      />
    )

    await pressShowButton()

    jest.advanceTimersByTime(3500)
    expect(screen.getAllByTestId(POPOVER_TEST_ID)).toHaveLength(1)

    jest.advanceTimersByTime(2000)
    jest.useRealTimers()

    await flushPromiseQueue()

    expect(screen.queryByTestId(POPOVER_TEST_ID)).not.toBeOnTheScreen()
  })

  it("hides when `undo` button is pressed", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          onUndoPress: jest.fn(),
        }}
      />
    )

    await pressShowButton()
    await fireEvent.press(within(screen.getByTestId(POPOVER_TEST_ID)).getByRole("button"))
    await act(async () => undefined)

    jest.useRealTimers()
    await flushPromiseQueue()

    expect(screen.queryByTestId(POPOVER_TEST_ID)).not.toBeOnTheScreen()
  })

  it("should call `onUndoPress` handler when `close` button is pressed", async () => {
    const onUndoMock = jest.fn()
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          onUndoPress: onUndoMock,
        }}
      />
    )

    await pressShowButton()
    await fireEvent.press(within(screen.getByTestId(POPOVER_TEST_ID)).getByRole("button"))
    await act(async () => undefined)

    expect(onUndoMock).toBeCalled()
  })

  it("should hide `undo` button when `onUndoPress` is not passed", async () => {
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
        }}
      />
    )

    await pressShowButton()

    expect(within(screen.getByTestId(POPOVER_TEST_ID)).queryAllByRole("button")).toHaveLength(0)
  })

  it("should call `onPress` handler when popover message is pressed", async () => {
    const onPress = jest.fn()
    await renderWithWrappers(
      <TestRenderer
        options={{
          title: "Some title",
          message: "Some message",
          onPress,
        }}
      />
    )

    await pressShowButton()
    await fireEvent.press(within(screen.getByTestId(POPOVER_TEST_ID)).getByRole("button"))
    await act(async () => undefined)

    expect(onPress).toHaveBeenCalled()
  })
})
