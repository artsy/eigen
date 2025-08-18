import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { OrderDetailsAskSpecialistModalTestsQuery } from "__generated__/OrderDetailsAskSpecialistModalTestsQuery.graphql"
import { OrderDetailsAskSpecialistModal } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsAskSpecialistModal"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const mockSubmit = jest.fn()
const mockShow = jest.fn()

jest.mock("app/utils/mutations/useSubmitInquiryRequest", () => ({
  useSubmitInquiryRequest: () => [mockSubmit, false],
}))

jest.mock("app/Components/Toast/toastHook", () => ({
  useToast: () => ({ show: mockShow }),
}))

describe("OrderDetailsAskSpecialistModal", () => {
  const mockHandleDismiss = jest.fn()

  const { renderWithRelay } = setupTestWrapper<OrderDetailsAskSpecialistModalTestsQuery>({
    Component: (props) => (
      <OrderDetailsAskSpecialistModal
        order={props.me!.order!}
        me={props.me!}
        visible={true}
        handleDismiss={mockHandleDismiss}
      />
    ),
    query: graphql`
      query OrderDetailsAskSpecialistModalTestsQuery @relay_test_operation {
        me {
          ...OrderDetailsAskSpecialistModal_me
          order(id: "order-id") {
            ...OrderDetailsAskSpecialistModal_order
          }
        }
      }
    `,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("submits inquiry with correct parameters", async () => {
    mockSubmit.mockImplementation(({ onCompleted }) => onCompleted())

    renderWithRelay({
      Me: () => ({ name: "John Doe", email: "john@example.com" }),
      Artwork: () => ({ internalID: "artwork-123" }),
    })

    expect(screen.getByText("Send message to Artsy")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "An Artsy Specialist is available to answer your questions and help you collect through Artsy."
      )
    ).toBeOnTheScreen()
    expect(screen.getByText("John Doe (john@example.com)")).toBeOnTheScreen()
    expect(screen.getByLabelText("Your message")).toBeOnTheScreen()
    expect(screen.getByText("Send")).toBeOnTheScreen()

    const messageInput = screen.getByLabelText("Your message")
    const sendButton = screen.getByText("Send")

    fireEvent.changeText(messageInput, "I have a question about this artwork")
    fireEvent.press(sendButton)

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              contactGallery: false,
              inquireableID: "artwork-123",
              inquireableType: "Artwork",
              message: "I have a question about this artwork",
            },
          },
        })
      )
    })
    expect(mockHandleDismiss).toHaveBeenCalled()
    expect(mockShow).toHaveBeenCalledWith("Your message has been sent", "bottom", {
      backgroundColor: "green100",
    })
  })

  it("shows error message on submission error", async () => {
    mockSubmit.mockImplementation(({ onError }) => onError())

    renderWithRelay({
      Me: () => ({ name: "John Doe", email: "john@example.com" }),
      Artwork: () => ({ internalID: "artwork-123" }),
    })

    const messageInput = screen.getByLabelText("Your message")
    const sendButton = screen.getByText("Send")

    fireEvent.changeText(messageInput, "Test message")
    fireEvent.press(sendButton)

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, we were unable to send this message. Please try again.")
      ).toBeOnTheScreen()
    })
  })

  it("does not submit when message is empty", () => {
    renderWithRelay({
      Me: () => ({ name: "John Doe", email: "john@example.com" }),
      Artwork: () => ({ internalID: "artwork-123" }),
    })

    const messageInput = screen.getByLabelText("Your message")
    const sendButton = screen.getByText("Send")
    fireEvent.press(sendButton)

    expect(mockSubmit).not.toHaveBeenCalled()

    fireEvent.changeText(messageInput, "   ")
    fireEvent.press(sendButton)

    expect(mockSubmit).not.toHaveBeenCalled()
  })
})
