import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Message } from "./Message"

describe("Message", () => {
  it("it renders", () => {
    const MessageComponent = renderWithWrappers(
      <Message variant="default" title="title" text="text" />
    )

    expect(MessageComponent).toBeTruthy()

    expect(MessageComponent.getByText("title")).toBeDefined()
    expect(MessageComponent.getByText("text")).toBeDefined()
  })

  it("does not show close button when !showCloseButton", () => {
    const { getByTestId } = renderWithWrappers(
      <Message variant="default" title="title" text="text" />
    )
    expect(() => getByTestId("Message-close-button")).toThrow(
      "Unable to find an element with testID: Message-close-button"
    )
  })

  it("shows close button when showCloseButton", () => {
    const { getByTestId } = renderWithWrappers(
      <Message variant="default" title="title" text="text" showCloseButton />
    )
    expect(getByTestId("Message-close-button")).toBeDefined()
  })

  it("fires onClose press event", () => {
    const onClose = jest.fn()
    const { getByTestId } = renderWithWrappers(
      <Message variant="default" onClose={onClose} title="title" text="text" showCloseButton />
    )
    fireEvent.press(getByTestId("Message-close-button"))
    expect(onClose).toHaveBeenCalled()
  })
})
