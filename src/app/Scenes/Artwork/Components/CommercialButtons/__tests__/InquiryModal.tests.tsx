import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
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
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense, useReducer } from "react"
import { graphql } from "react-relay"

describe("inquiry modal", () => {
  let initialState: ArtworkInquiryContextState

  const { renderWithRelay } = setupTestWrapper<InquiryModalTestsQuery>({
    Component: ({ artwork, me }) => (
      <Suspense fallback={null}>
        <ArtworkInquiryContext.Provider value={useReducerWithInquiryModalVisible(initialState)}>
          <InquiryModal artwork={artwork} me={me} />
        </ArtworkInquiryContext.Provider>
      </Suspense>
    ),
    query: graphql`
      query InquiryModalTestsQuery @relay_test_operation {
        artwork(id: "artwork-id") @required(action: NONE) {
          ...InquiryModal_artwork
        }
        me @required(action: NONE) {
          ...useSendInquiry_me
          ...MyProfileEditModal_me
        }
      }
    `,
  })

  beforeEach(() => {
    initialState = { ...initialArtworkInquiryState, inquiryModalVisible: true }
  })

  it("renders", async () => {
    await renderWithRelay({ Artwork: () => mockArtwork })

    expect(screen.getByText("Artist Name")).toBeVisible()
    expect(screen.getByText("Title, Date")).toBeVisible()
    expect(screen.getByLabelText("Image of Title")).toBeVisible()
    expect(screen.getByText("Question")).toBeVisible()
    expect(screen.getByLabelText("Your message").props.value).toBe("")
  })

  it("opens the shipping modal when the 'add your location' field is pressed", async () => {
    await renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
        inquiryQuestions: [
          {
            internalID: InquiryQuestionIDs.Shipping,
            question: "Shipping",
          },
        ],
      }),
    })

    await fireEvent.press(screen.getByText("Shipping"))

    await waitFor(() => {
      expect(screen.getByText("Add your location")).toBeVisible()
    })

    await fireEvent.press(screen.getByText("Add your location"))

    await waitFor(() => expect(screen.getByText("Add Location")).toBeVisible())
  })

  it("enables the 'send' button when an inquiry question is selected", async () => {
    await renderWithRelay({ Artwork: () => mockArtwork })

    // clearing the input field
    await fireEvent.changeText(screen.getByLabelText("Your message"), "")

    expect(screen.getByText("Send")).toBeDisabled()

    await fireEvent.press(screen.getByText("Question"))

    await waitFor(() => expect(screen.getByText("Send")).toBeEnabled())
  })

  it("closes when the 'cancel' button is pressed", async () => {
    await renderWithRelay()
    expect(screen.getByText("What information are you looking for?")).toBeOnTheScreen()

    await fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))

    expect(screen.queryByText("What information are you looking for?")).not.toBeOnTheScreen()
  })

  it("does not show 'What information are you looking for?' when there are no inquiry questions", async () => {
    await renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
        inquiryQuestions: [],
      }),
    })

    expect(screen.queryByText("What information are you looking for?")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Your message")).toBeOnTheScreen()
  })

  it("tracks an event when the inquiry modal is closed", async () => {
    await renderWithRelay({ Artwork: () => mockArtwork })

    await fireEvent.press(screen.getByTestId("fancy-modal-header-right-button"))

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action_type: "tap",
        action_name: "inquiryCancel",
        owner_type: "Artwork",
        owner_id: "artwork-id",
        owner_slug: "artwork-slug",
      })
    })
  })

  describe("when the inquiry is successfully sent", () => {
    const sendInquiry = jest.fn()
    beforeAll(() => {
      jest
        .spyOn(require("app/Scenes/Artwork/hooks/useSendInquiry"), "useSendInquiry")
        .mockReturnValue({
          sendInquiry,
          error: null,
        })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("tracks two events before and after the inquiry is successfully sent", async () => {
      await renderWithRelay({ Artwork: () => mockArtwork })

      await fireEvent.press(screen.getByText("Question"))

      await waitFor(() => expect(screen.getByText("Send")).toBeEnabled())

      await fireEvent.press(screen.getByText("Send"))

      expect(sendInquiry).toHaveBeenCalledWith(expect.toBeString())
    })

    it("displays the profile prompt", async () => {
      initialState = { ...initialState, profilePromptVisible: true }
      await renderWithRelay({ Artwork: () => mockArtwork })

      expect(
        screen.getByText("Stand out and save time by sharing details with the gallery.")
      ).toBeOnTheScreen()
    })

    it("displays the collection prompt", async () => {
      initialState = { ...initialState, collectionPromptVisible: true }
      await renderWithRelay({ Artwork: () => mockArtwork })

      expect(
        screen.getByText("Already own works by this artist or similar artists?")
      ).toBeOnTheScreen()
      expect(
        screen.getByText("Showcase your collection and stand out with galleries.")
      ).toBeOnTheScreen()
    })
  })
})

const mockArtwork = {
  internalID: "artwork-id",
  slug: "artwork-slug",
  title: "Title",
  date: "Date",
  artistNames: "Artist Name",
  image: {
    url: "https://example.com/image.jpg",
  },
  inquiryQuestions: [
    {
      internalID: "question-id",
      question: "Question",
    },
  ],
  partner: {
    name: "Partner Name",
  },
}

const useReducerWithInquiryModalVisible = (initialState: ArtworkInquiryContextState) => {
  const [state, dispatch] = useReducer<ArtworkInquiryContextState, [ArtworkInquiryActions]>(
    artworkInquiryStateReducer,
    initialState
  )

  return {
    state,
    dispatch,
  }
}
