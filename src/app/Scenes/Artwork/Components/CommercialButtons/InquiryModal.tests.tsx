import { fireEvent, screen } from "@testing-library/react-native"
import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import {
  ArtworkInquiryContext,
  initialArtworkInquiryState,
  reducer,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import moment from "moment"
import React, { Reducer, useReducer } from "react"
import { graphql } from "react-relay"
import { InquiryModalFragmentContainer } from "./InquiryModal"

const toggleVisibility = jest.fn()
const onMutationSuccessful = jest.fn()

const mockReducer = jest.fn((state, action) => reducer(state, action))

const { renderWithRelay } = setupTestWrapper<InquiryModalTestsQuery>({
  Component: (props) => {
    const [state, dispatch] = useReducer<
      Reducer<ArtworkInquiryContextState, ArtworkInquiryActions>
    >(mockReducer, initialArtworkInquiryState)

    return (
      <ArtworkInquiryContext.Provider value={{ state, dispatch }} {...props}>
        <FakeApp {...props} />
      </ArtworkInquiryContext.Provider>
    )
  },
  query: graphql`
    query InquiryModalTestsQuery @relay_test_operation {
      artwork(id: "pumpkins") {
        ...InquiryModal_artwork
      }
      me @required(action: NONE) {
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
    <InquiryModalFragmentContainer
      artwork={props!.artwork!}
      me={props!.me}
      modalIsVisible={modalProps.modalIsVisible}
      toggleVisibility={modalProps.toggleVisibility}
      onMutationSuccessful={modalProps.onMutationSuccessful}
    />
  )
}

describe("InquiryModal", () => {
  beforeEach(() => {
    mockReducer.mockClear()
  })

  it("renders the modal", () => {
    renderWithRelay()
    expect(screen.getByText("What information are you looking for?")).toBeOnTheScreen()
  })

  it("opens and closes the modal", async () => {
    renderWithRelay()
    expect(screen.getByTestId("inquiry-modal")).toHaveProp("visible", true)

    const cancelButton = screen.getByTestId("fancy-modal-header-left-button")

    fireEvent.press(cancelButton)
    await flushPromiseQueue()

    expect(screen.getByTestId("inquiry-modal")).toHaveProp("visible", false)
  })

  describe("user can select checkboxes", () => {
    it("user can select 'Price & Availability'", () => {
      renderWithRelay({
        Artwork: () => ({
          inquiryQuestions: [
            { internalID: "price_and_availability", question: "Price & Availability" },
          ],
        }),
      })

      fireEvent.press(screen.getByText("Price & Availability"))

      expect(mockReducer).toHaveBeenCalledWith(expect.anything(), {
        type: "selectInquiryQuestion",
        payload: {
          details: null,
          isChecked: true,
          questionID: "price_and_availability",
        },
      })
    })

    it("user can select 'Shipping quote'", () => {
      renderWithRelay({
        Artwork: () => ({
          inquiryQuestions: [{ internalID: "shipping_quote", question: "Shipping" }],
        }),
      })

      fireEvent.press(screen.getByText("Shipping"))

      expect(mockReducer).toHaveBeenCalledWith(expect.anything(), {
        type: "selectInquiryQuestion",
        payload: {
          details: undefined,
          isChecked: true,
          questionID: "shipping_quote",
        },
      })
    })

    it("user can select 'Condition and provenance'", () => {
      renderWithRelay({
        Artwork: () => ({
          inquiryQuestions: [
            { internalID: "condition_and_provenance", question: "Condition & Provenance" },
          ],
        }),
      })

      fireEvent.press(screen.getByText("Condition & Provenance"))

      expect(mockReducer).toHaveBeenCalledWith(expect.anything(), {
        type: "selectInquiryQuestion",
        payload: {
          details: null,
          isChecked: true,
          questionID: "condition_and_provenance",
        },
      })
    })
  })

  describe("user can add a custom message", () => {
    it("add custom message", () => {
      renderWithRelay()
      const testString = "Test message"
      const input = screen.getByTestId("add-message-input")
      fireEvent.changeText(input, testString)

      expect(mockReducer).toHaveBeenCalledWith(expect.anything(), {
        type: "setMessage",
        payload: testString,
      })
    })
  })

  describe("when submiting an inquiry", () => {
    it("it shows error message on failed inquiry", async () => {
      const { env } = renderWithRelay({
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
      const sendButton = screen.getByTestId("fancy-modal-header-right-button")

      fireEvent.press(sendButton)
      rejectMostRecentRelayOperation(env, new Error())

      await flushPromiseQueue()

      expect(
        screen.getByText("Sorry, we were unable to send this message. Please try again.")
      ).toBeOnTheScreen()
    })

    describe("when the inquiry is successful", () => {
      describe("when the user's profile is incomplete", () => {
        const incompleteUserProfile = {
          name: "Marcus Tullius Cicero",
          location: null,
          profession: null,
        }

        describe("when the user was prompted to update their profile less than 30 days ago", () => {
          it("shows the success notification", async () => {
            jest.useFakeTimers()
            const { mockResolveLastOperation } = renderWithRelay({
              Artwork: () => ({
                inquiryQuestions: [
                  { internalID: "price_and_availability", question: "Price & Availability" },
                ],
              }),
              Me: () => ({
                ...incompleteUserProfile,
                collectorProfile: {
                  lastUpdatePromptAt: moment().subtract(29, "days").toISOString(),
                },
              }),
            })

            fireEvent.press(screen.getByText("Price & Availability"))
            fireEvent.press(screen.getByText("Send"))

            mockResolveLastOperation({})

            jest.advanceTimersByTime(500)

            expect(mockReducer).not.toHaveBeenCalledWith(expect.anything(), {
              type: "showProfileUpdatePrompt",
            })

            expect(onMutationSuccessful).toHaveBeenCalledWith(true)

            jest.useRealTimers()
          })
        })

        describe("when the user was last prompted more than 30 days ago", () => {
          it("prompts user to update profile", async () => {
            const { mockResolveLastOperation } = renderWithRelay({
              Artwork: () => ({
                inquiryQuestions: [
                  { internalID: "price_and_availability", question: "Price & Availability" },
                ],
              }),
              Me: () => ({
                ...incompleteUserProfile,
                collectorProfile: {
                  lastUpdatePromptAt: moment().subtract(31, "days").toISOString(),
                },
              }),
            })

            const checkbox = screen.getByText("Price & Availability")
            fireEvent.press(checkbox)
            const sendButton = screen.getByText("Send")
            fireEvent.press(sendButton)

            mockResolveLastOperation({})

            await flushPromiseQueue()

            expect(mockReducer).toHaveBeenCalledWith(expect.anything(), {
              type: "showProfileUpdatePrompt",
            })
          })
        })
      })

      describe("when the user's profile is complete", () => {
        const completeUserProfile = {
          name: "Marcus Tullius Cicero",
          location: { city: "Rome", country: "Italy" },
          profession: "Politician",
          otherRelevantPositions: "Consul of the Roman Republic",
        }

        it("shows the success notification", async () => {
          jest.useFakeTimers()
          const { mockResolveLastOperation } = renderWithRelay({
            Artwork: () => ({
              inquiryQuestions: [
                { internalID: "price_and_availability", question: "Price & Availability" },
              ],
            }),
            Me: () => ({
              completeUserProfile,
            }),
          })

          fireEvent.press(screen.getByText("Price & Availability"))
          fireEvent.press(screen.getByText("Send"))

          mockResolveLastOperation({})

          jest.advanceTimersByTime(500)

          expect(mockReducer).not.toHaveBeenCalledWith(expect.anything(), {
            type: "showProfileUpdatePrompt",
          })

          expect(onMutationSuccessful).toHaveBeenCalledWith(true)

          jest.useRealTimers()
        })
      })
    })
  })
})
