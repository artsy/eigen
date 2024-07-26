import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import { AUTOMATED_MESSAGES } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import {
  ArtworkInquiryContext,
  initialArtworkInquiryState,
  artworkInquiryStateReducer,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
  InquiryQuestionIDs,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Reducer, useReducer } from "react"
import { graphql } from "react-relay"

describe("InquiryModal", () => {
  it("displays artwork metadata", () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Artwork Title",
        date: "2021",
        artistNames: "Artist Name",
        image: {
          url: "https://example.com/image.jpg",
        },
      }),
    })

    expect(screen.getByText("Artist Name")).toBeVisible()
    expect(screen.getByText("Artwork Title, 2021")).toBeVisible()
    expect(screen.getByLabelText("Image of Artwork Title")).toBeVisible()
  })

  it("closes when the 'cancel' button is pressed", async () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("Cancel"))

    await waitFor(() => {
      expect(screen.queryByText("What information are you looking for?")).toBeNull()
    })
  })

  it("displays inquiry questions", () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          {
            internalID: "question-id",
            question: "Question",
          },
        ],
      }),
    })

    expect(screen.getByText("Question")).toBeVisible()
  })

  it("enables the 'send' button when an inquiry question is selected", async () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          {
            internalID: "question-id",
            question: "Question",
          },
        ],
      }),
    })

    expect(screen.getByText("Send")).toBeDisabled()

    fireEvent.press(screen.getByText("Question"))

    await waitFor(() => {
      expect(screen.getByText("Send")).toBeEnabled()
    })
  })

  it("opens the shipping modal when the 'add your location' field is pressed", async () => {
    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          {
            internalID: InquiryQuestionIDs.Shipping,
            question: "Shipping",
          },
        ],
      }),
    })

    fireEvent.press(screen.getByText("Shipping"))

    await waitFor(() => {
      expect(screen.getByText("Add your location")).toBeVisible()
    })

    fireEvent.press(screen.getByText("Add your location"))

    await waitFor(() => {
      expect(screen.getByText("Add Location")).toBeVisible()
    })
  })

  it("displays a random automated message", () => {
    renderWithRelay()

    expect(AUTOMATED_MESSAGES).toContain(screen.getByLabelText("Add message").props.value)
  })

  it("displays a success message when the inquiry is sent", async () => {
    const mockUseSubmitInquiryRequest = jest
      .spyOn(
        require("app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"),
        "useSubmitInquiryRequest"
      )
      .mockImplementation(() => [
        jest.fn(({ onCompleted }) => {
          onCompleted()
        }),
      ])

    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          {
            internalID: "question-id",
            question: "Question",
          },
        ],
      }),
    })

    fireEvent.press(screen.getByText("Question"))

    await waitFor(() => {
      expect(screen.getByText("Send")).toBeEnabled()
    })

    fireEvent.press(screen.getByText("Send"))

    await waitFor(() => {
      expect(screen.getByText("Message Sent")).toBeVisible()
    })

    mockUseSubmitInquiryRequest.mockRestore()
  })

  it("displays an error message when the inquiry fails to send", async () => {
    const mockUseSubmitInquiryRequest = jest
      .spyOn(
        require("app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"),
        "useSubmitInquiryRequest"
      )
      .mockImplementation(() => [
        jest.fn(({ onError }) => {
          onError()
        }),
      ])

    renderWithRelay({
      Artwork: () => ({
        inquiryQuestions: [
          {
            internalID: "question-id",
            question: "Question",
          },
        ],
      }),
    })

    fireEvent.press(screen.getByText("Question"))

    await waitFor(() => {
      expect(screen.getByText("Send")).toBeEnabled()
    })

    fireEvent.press(screen.getByText("Send"))

    await waitFor(() => {
      expect(
        screen.getByText("Sorry, we were unable to send this message. Please try again.")
      ).toBeVisible()
    })

    mockUseSubmitInquiryRequest.mockRestore()
  })

  test.todo(
    "displays a profile prompt after the inquiry is sent if the user has not completed their profile"
  )

  test.todo("tracks an event when the inquiry modal is closed")
  test.todo("tracks an event before sending the inquiry")
  test.todo("tracks an event when the inquiry is successfully sent")
  test.todo("tracks an event when the inquiry fails to send")
})

const { renderWithRelay } = setupTestWrapper<InquiryModalTestsQuery>({
  Component: ({ artwork, me }) => (
    <ArtworkInquiryContext.Provider value={useReducerWithInquiryModalVisible()}>
      <InquiryModal artwork={artwork} me={me} />
    </ArtworkInquiryContext.Provider>
  ),
  query: graphql`
    query InquiryModalTestsQuery @relay_test_operation {
      artwork(id: "artwork-id") @required(action: NONE) {
        ...InquiryModal_artwork
      }
      me @required(action: NONE) {
        ...InquiryModal_me
      }
    }
  `,
})

const useReducerWithInquiryModalVisible = () => {
  const [state, dispatch] = useReducer<Reducer<ArtworkInquiryContextState, ArtworkInquiryActions>>(
    artworkInquiryStateReducer,
    { ...initialArtworkInquiryState, inquiryModalVisible: true }
  )

  return {
    state,
    dispatch,
  }
}
