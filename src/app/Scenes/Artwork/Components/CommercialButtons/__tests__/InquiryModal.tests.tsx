import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import { AUTOMATED_MESSAGES } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
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

jest.mock("app/system/flags/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(),
}))

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
    ;(useExperimentVariant as jest.Mock).mockReturnValue({ variant: {} })
  })

  it("renders", () => {
    renderWithRelay({ Artwork: () => mockArtwork })

    expect(screen.getByText("Artist Name")).toBeVisible()
    expect(screen.getByText("Title, Date")).toBeVisible()
    expect(screen.getByLabelText("Image of Title")).toBeVisible()
    expect(screen.getByText("Question")).toBeVisible()
    expect(AUTOMATED_MESSAGES).toContain(screen.getByLabelText("Add message").props.value)
  })

  it("opens the shipping modal when the 'add your location' field is pressed", async () => {
    renderWithRelay({
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

    fireEvent.press(screen.getByText("Shipping"))

    await waitFor(() => {
      expect(screen.getByText("Add your location")).toBeVisible()
    })

    fireEvent.press(screen.getByText("Add your location"))

    await waitFor(() => expect(screen.getByText("Add Location")).toBeVisible())
  })

  it("enables the 'send' button when an inquiry question is selected", async () => {
    renderWithRelay({ Artwork: () => mockArtwork })

    // clearing the input field
    fireEvent.changeText(screen.getByLabelText("Add message"), "")

    expect(screen.getByText("Send")).toBeDisabled()

    fireEvent.press(screen.getByText("Question"))

    await waitFor(() => expect(screen.getByText("Send")).toBeEnabled())
  })

  it("closes when the 'cancel' button is pressed", async () => {
    renderWithRelay()
    expect(screen.getByText("What information are you looking for?")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Cancel"))

    expect(screen.queryByText("What information are you looking for?")).not.toBeOnTheScreen()
  })

  it("does not show 'What information are you looking for?' when there are no inquiry questions", () => {
    renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
        inquiryQuestions: [],
      }),
    })

    expect(screen.queryByText("What information are you looking for?")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Add message")).toBeOnTheScreen()
  })

  it("tracks an event when the inquiry modal is closed", async () => {
    renderWithRelay({ Artwork: () => mockArtwork })

    fireEvent.press(screen.getByText("Cancel"))

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
      renderWithRelay({ Artwork: () => mockArtwork })

      fireEvent.press(screen.getByText("Question"))

      await waitFor(() => expect(screen.getByText("Send")).toBeEnabled())

      fireEvent.press(screen.getByText("Send"))

      expect(sendInquiry).toHaveBeenCalledWith(expect.toBeString())
    })

    it("displays the profile prompt", async () => {
      initialState = { ...initialState, profilePromptVisible: true }
      renderWithRelay({ Artwork: () => mockArtwork })

      expect(
        screen.getByText("Inquiry sent! Tell Partner Name more about yourself.")
      ).toBeOnTheScreen()
    })

    it("displays the collection prompt", async () => {
      initialState = { ...initialState, collectionPromptVisible: true }
      renderWithRelay({ Artwork: () => mockArtwork })

      expect(
        screen.getByText("Inquiry sent! Tell us about the artists in your collection.")
      ).toBeOnTheScreen()
    })
  })

  describe("template messages A/B test", () => {
    describe("on control", () => {
      beforeEach(() => {
        // mock experiment as "control"
        ;(useExperimentVariant as jest.Mock).mockReturnValue({
          variant: { enabled: true, name: "control" },
        })
      })

      it("prefills the input with a templated message", () => {
        renderWithRelay({ Artwork: () => mockArtwork })

        expect(AUTOMATED_MESSAGES).toContain(screen.getByLabelText("Add message").props.value)
      })
    })

    describe("on experiment", () => {
      beforeEach(() => {
        // mock experiment as "experiment"
        ;(useExperimentVariant as jest.Mock).mockReturnValue({
          variant: { enabled: true, name: "experiment" },
        })
      })

      it("shows the input empty", () => {
        renderWithRelay({ Artwork: () => mockArtwork })

        expect(screen.getByLabelText("Add message").props.value).toBe("")
      })
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
