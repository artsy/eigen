import { fireEvent, screen } from "@testing-library/react-native"
import { InquiryDrawerTestsQuery } from "__generated__/InquiryDrawerTestsQuery.graphql"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { InquiryDrawerFragmentContainer } from "./InquiryDrawer"

const mockDispatch = jest.fn()

const initialState = {
  shippingLocation: null,
  message: undefined,
  inquiryQuestions: [],
  isInquiryDialogOpen: false,
  isShippingQuestionDialogOpen: false,
  isInquirySuccessNotificationOpen: false,
}

const { renderWithRelay } = setupTestWrapper<InquiryDrawerTestsQuery>({
  Component: (props) => {
    return (
      <ArtworkInquiryContext.Provider
        value={{ state: initialState, dispatch: mockDispatch }}
        {...props}
      >
        <InquiryDrawerFragmentContainer artwork={props!.artwork!} />
      </ArtworkInquiryContext.Provider>
    )
  },
  query: graphql`
    query InquiryDrawerTestsQuery @relay_test_operation {
      artwork(id: "pumpkins") {
        ...InquiryDrawer_artwork
      }
    }
  `,
})

describe("InquiryDrawer", () => {
  it("renders inquiry questions", () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          { internalID: "price_and_availability", question: "Price & Availability" },
          { internalID: "shipping_quote", question: "Shipping" },
          { internalID: "condition_and_provenance", question: "Condition & Provance" },
        ],
      }),
    })

    expect(screen.getByText("What information are you looking for?")).toBeOnTheScreen()
    expect(screen.getByText("Price & Availability")).toBeOnTheScreen()
    expect(screen.getByText("Shipping")).toBeOnTheScreen()
    expect(screen.getByText("Condition & Provance")).toBeOnTheScreen()
  })

  it("dispatches a selectInquiryQuestion action when a question is selected", () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          { internalID: "price_and_availability", question: "Price & Availability" },
        ],
      }),
    })

    const checkbox = screen.getByTestId("checkbox-price_and_availability")
    fireEvent.press(checkbox)

    expect(mockDispatch).toBeCalledWith({
      payload: {
        details: null,
        isChecked: true,
        questionID: "price_and_availability",
      },
      type: "selectInquiryQuestion",
    })
  })

  it("dispatches a setMessage action when the message is changed", () => {
    renderWithRelay()

    const text = "Hello"
    const input = screen.getByTestId("message-input")

    fireEvent.changeText(input, text)

    expect(mockDispatch).toBeCalledWith({
      payload: text,
      type: "setMessage",
    })
  })

  it("it shows an error message when the inquiry fails to send", async () => {
    const { mockRejectLastOperation } = renderWithRelay(
      {
        Artwork: () => ({
          inquiryQuestions: [
            { internalID: "price_and_availability", question: "Price & Availability" },
            { internalID: "shipping_quote", question: "Shipping" },
            { internalID: "condition_and_provenance", question: "Condition & Provance" },
          ],
        }),
      },
      {
        value: {
          state: {
            inquiryQuestions: ["shipping_quote"],
          },
          dispatch: jest.fn(),
        },
      }
    )

    const sendButton = screen.getByTestId("send-button")

    fireEvent.press(sendButton)

    mockRejectLastOperation(new Error())

    await flushPromiseQueue()

    expect(
      screen.getByText("Sorry, we were unable to send this message. Please try again.")
    ).toBeOnTheScreen()
  })
})
