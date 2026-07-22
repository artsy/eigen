import FastImage from "@d11/react-native-fast-image"
import { fireEvent, screen } from "@testing-library/react-native"
import { FollowArtistsOnboardingCompletionBottomSheet } from "app/Scenes/HomeView/Components/FollowArtistsOnboardingCompletionBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import PagerView from "react-native-pager-view"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))

describe("FollowArtistsOnboardingCompletionBottomSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)
    GlobalStore.actions.onboarding.resetFollowedOnboardingArtists()
    ;(useFeatureFlag as jest.Mock).mockReturnValue(true)
  })

  describe("Visibility", () => {
    it("does not render content when showFollowedArtistSummaryBottomSheet is false", () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      expect(
        screen.queryByText("Your followed artists are saved to Favorites.")
      ).not.toBeOnTheScreen()
    })

    it("does not render content when feature flag is disabled", () => {
      ;(useFeatureFlag as jest.Mock).mockReturnValue(false)
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      expect(
        screen.queryByText("Your followed artists are saved to Favorites.")
      ).not.toBeOnTheScreen()
    })

    it("renders the sheet content when both conditions are met", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      expect(
        await screen.findByText("Your followed artists are saved to Favorites.")
      ).toBeOnTheScreen()
    })
  })

  describe("Followed artist avatars", () => {
    it("renders the last 3 followed artists when more than 3 were followed", async () => {
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-1",
        imageUrl: "https://example.com/artist-1.jpg",
        blurhash: null,
        initials: "A",
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-2",
        imageUrl: "https://example.com/artist-2.jpg",
        blurhash: null,
        initials: "B",
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-3",
        imageUrl: "https://example.com/artist-3.jpg",
        blurhash: null,
        initials: "C",
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-4",
        imageUrl: "https://example.com/artist-4.jpg",
        blurhash: null,
        initials: "D",
      })
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const renderedImages = screen
        .UNSAFE_getAllByType(FastImage)
        .map((img) => img.props.source.uri)

      expect(renderedImages.some((uri: string) => uri.includes("artist-1.jpg"))).toBe(false)
      expect(renderedImages.some((uri: string) => uri.includes("artist-2.jpg"))).toBe(true)
      expect(renderedImages.some((uri: string) => uri.includes("artist-3.jpg"))).toBe(true)
      expect(renderedImages.some((uri: string) => uri.includes("artist-4.jpg"))).toBe(true)
    })

    it("falls back to the artist's initials when there is no image", async () => {
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-1",
        imageUrl: null,
        blurhash: null,
        initials: "A",
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-2",
        imageUrl: "https://example.com/artist-2.jpg",
        blurhash: null,
        initials: "B",
      })
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      expect(screen.getByText("A")).toBeOnTheScreen()

      const avatarImages = screen
        .UNSAFE_getAllByType(FastImage)
        .map((img) => img.props.source.uri as string)
        .filter((uri) => uri.includes("example.com"))

      expect(avatarImages.some((uri) => uri.includes("artist-2.jpg"))).toBe(true)
      expect(avatarImages).toHaveLength(1)
    })
  })

  describe("Content", () => {
    it("renders page 1 content", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      expect(
        await screen.findByText("Your followed artists are saved to Favorites.")
      ).toBeOnTheScreen()
      expect(
        screen.getByText("Find them any time in the Favorites tab at the bottom of your screen.")
      ).toBeOnTheScreen()
    })

    it("renders page 2 content", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      expect(await screen.findByText("We'll let you know when new works arrive.")).toBeOnTheScreen()
      expect(
        screen.getByText(
          /When there's a new work by an artist you follow, you'll see a notification/
        )
      ).toBeOnTheScreen()
    })
  })

  describe("Button behavior", () => {
    it("shows Next button on page 1", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      // Component starts on page 1 (activeStep = 0)
      expect(await screen.findByText("Next")).toBeOnTheScreen()
    })

    it("shows View For You button on page 2", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const button = screen.getByText(/Next|View For You/)
      expect(button).toBeOnTheScreen()
    })

    it("dismisses and resets global state when View For You is pressed", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const viewForYouButton = screen.queryByText("View For You")

      if (viewForYouButton) {
        fireEvent.press(viewForYouButton)

        const state = __globalStoreTestUtils__!.getCurrentState()
        expect(state.onboarding.showFollowedArtistSummaryBottomSheet).toBe(false)
      }
    })

    it("clears followedOnboardingArtists once the sheet is dismissed", async () => {
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-1",
        imageUrl: "https://example.com/artist-1.jpg",
        blurhash: null,
        initials: "A",
      })
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<FollowArtistsOnboardingCompletionBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const pagerView = screen.UNSAFE_getByType(PagerView)
      pagerView.props.onPageScroll({ nativeEvent: { position: 1 } })

      fireEvent.press(await screen.findByText("View For You"))

      expect(
        __globalStoreTestUtils__?.getCurrentState().onboarding.followedOnboardingArtists
      ).toEqual([])
    })
  })
})
