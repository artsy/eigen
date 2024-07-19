import { fireEvent, screen } from "@testing-library/react-native"
import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import {
  ArtworkInquiryContext,
  initialArtworkInquiryState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import React from "react"
import { graphql } from "react-relay"

const toggleVisibility = jest.fn()
const onMutationSuccessful = jest.fn()
const mockDispatch = jest.fn()

const { renderWithRelay } = setupTestWrapper<InquiryModalTestsQuery>({
  Component: (props) => {
    return (
      <ArtworkInquiryContext.Provider
        value={{ state: initialArtworkInquiryState, dispatch: mockDispatch }}
        {...props}
      >
        <FakeApp {...props} />
      </ArtworkInquiryContext.Provider>
    )
  },
  query: graphql`
    query InquiryModalTestsQuery @relay_test_operation {
      artwork(id: "pumpkins") {
        ...InquiryModal_artwork
      }
      me {
        ...InquiryModal_me
      }
    }
  `,
})

// An app shell that holds modal visibility properties
const FakeApp = (props: InquiryModalTestsQuery["response"]) => {
  const [modalIsVisible, setModalIsVisible] = React.useState(true)
  toggleVisibility.mockImplementation(() => setModalIsVisible(!modalIsVisible))
  const modalProps = {
    modalIsVisible,
    toggleVisibility,
    onMutationSuccessful,
  }

  return (
    <InquiryModal
      artwork={props!.artwork!}
      me={props!.me!}
      modalIsVisible={modalProps.modalIsVisible}
      toggleVisibility={modalProps.toggleVisibility}
    />
  )
}

describe("<InquiryModal />", () => {
  it("renders the modal", () => {
    renderWithRelay()
    expect(screen.getByText("What information are you looking for?")).toBeOnTheScreen()
  })

  it("open and close modal", async () => {
    renderWithRelay()
    expect(screen.getByTestId("inquiry-modal")).toHaveProp("visible", true)

    const cancelButton = screen.getByTestId("fancy-modal-header-left-button")

    fireEvent.press(cancelButton)
    await flushPromiseQueue()

    expect(screen.getByTestId("inquiry-modal")).toHaveProp("visible", false)
  })
})

describe("user can select checkboxes", () => {
  it("user can select 'Price & Availability'", () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          { internalID: "price_and_availability", question: "Price & Availability" },
          { internalID: "shipping_quote", question: "Shipping" },
          { internalID: "condition_and_provenance", question: "Condition & Provance" },
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

  it("user can select 'Shipping quote'", () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          { internalID: "price_and_availability", question: "Price & Availability" },
          { internalID: "shipping_quote", question: "Shipping" },
          { internalID: "condition_and_provenance", question: "Condition & Provance" },
        ],
      }),
    })

    const checkbox = screen.getByTestId("checkbox-shipping_quote")
    fireEvent.press(checkbox)

    expect(mockDispatch).toBeCalledWith({
      payload: {
        isChecked: true,
        questionID: "shipping_quote",
      },
      type: "selectInquiryQuestion",
    })
  })

  it("user can select 'Condition and provance'", () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          { internalID: "price_and_availability", question: "Price & Availability" },
          { internalID: "shipping_quote", question: "Shipping" },
          { internalID: "condition_and_provenance", question: "Condition & Provance" },
        ],
      }),
    })
    const checkbox = screen.getByTestId("checkbox-condition_and_provenance")
    fireEvent.press(checkbox)

    expect(mockDispatch).toBeCalledWith({
      payload: {
        details: null,
        isChecked: true,
        questionID: "condition_and_provenance",
      },
      type: "selectInquiryQuestion",
    })
  })
})

describe("when submiting an inquiry", () => {
  it("it shows error message on failed inquiry", async () => {
    const { env } = renderWithRelay(
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
            inquiryQuestions: ["test"],
          },
          dispatch: mockDispatch,
        },
      }
    )

    const checkbox = screen.getByTestId("checkbox-shipping_quote")

    fireEvent.press(checkbox)
    const sendButton = screen.getByTestId("fancy-modal-header-right-button")

    fireEvent.press(sendButton)
    rejectMostRecentRelayOperation(env, new Error())

    await flushPromiseQueue()

    expect(
      screen.getByText("Sorry, we were unable to send this message. Please try again.")
    ).toBeOnTheScreen()
  })
})

describe("user can add a custom message", () => {
  it("add custom message", () => {
    renderWithRelay()
    const testString = "Test message"
    const input = screen.getByTestId("add-message-input")
    fireEvent.changeText(input, testString)

    expect(mockDispatch).toBeCalledWith({
      payload: testString,
      type: "setMessage",
    })
  })
})
