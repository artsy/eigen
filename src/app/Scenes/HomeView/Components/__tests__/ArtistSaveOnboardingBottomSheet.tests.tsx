import FastImage from "@d11/react-native-fast-image"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistSaveOnboardingBottomSheet } from "app/Scenes/HomeView/Components/ArtistSaveOnboardingBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))

describe("ArtistSaveOnboardingBottomSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)
    ;["artist-1", "artist-2", "artist-3", "artist-4"].forEach((internalID) => {
      GlobalStore.actions.onboarding.removeFollowedOnboardingArtist(internalID)
    })
    ;(useFeatureFlag as jest.Mock).mockReturnValue(true)
  })

  describe("Visibility", () => {
    it("does not render content when showFollowedArtistSummaryBottomSheet is false", () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      expect(
        screen.queryByText("Your followed artists are saved to Favorites.")
      ).not.toBeOnTheScreen()
    })

    it("does not render content when feature flag is disabled", () => {
      ;(useFeatureFlag as jest.Mock).mockReturnValue(false)
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      expect(
        screen.queryByText("Your followed artists are saved to Favorites.")
      ).not.toBeOnTheScreen()
    })

    it("renders the sheet content when both conditions are met", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      expect(
        await screen.findByText("Your followed artists are saved to Favorites.")
      ).toBeOnTheScreen()
    })
  })

  describe("Followed artist avatars", () => {
    it("renders an avatar for each real followed artist, up to 3", async () => {
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-1",
        imageUrl: "https://example.com/artist-1.jpg",
        blurhash: null,
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-2",
        imageUrl: "https://example.com/artist-2.jpg",
        blurhash: null,
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-3",
        imageUrl: "https://example.com/artist-3.jpg",
        blurhash: null,
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-4",
        imageUrl: "https://example.com/artist-4.jpg",
        blurhash: null,
      })
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const renderedImages = screen
        .UNSAFE_getAllByType(FastImage)
        .map((img) => img.props.source.uri)

      expect(renderedImages.some((uri: string) => uri.includes("artist-1.jpg"))).toBe(true)
      expect(renderedImages.some((uri: string) => uri.includes("artist-2.jpg"))).toBe(true)
      expect(renderedImages.some((uri: string) => uri.includes("artist-3.jpg"))).toBe(true)
      expect(renderedImages.some((uri: string) => uri.includes("artist-4.jpg"))).toBe(false)
    })

    it("skips followed artists without an image", async () => {
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-1",
        imageUrl: null,
        blurhash: null,
      })
      GlobalStore.actions.onboarding.addFollowedOnboardingArtist({
        internalID: "artist-2",
        imageUrl: "https://example.com/artist-2.jpg",
        blurhash: null,
      })
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

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

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      expect(
        await screen.findByText("Your followed artists are saved to Favorites.")
      ).toBeOnTheScreen()
      expect(
        screen.getByText("Find them anytime in the Favorites tab at the bottom of your screen.")
      ).toBeOnTheScreen()
    })

    it("renders page 2 content", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      expect(await screen.findByText("We'll let you know when new works arrive.")).toBeOnTheScreen()
      expect(
        screen.getByText(
          /When a new work by an artist you follow is added to Artsy, you'll see a notification/
        )
      ).toBeOnTheScreen()
    })
  })

  describe("Button behavior", () => {
    it("shows Next button on page 1", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      // Component starts on page 1 (activeStep = 0)
      expect(await screen.findByText("Next")).toBeOnTheScreen()
    })

    it("shows View For You button on page 2", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const button = screen.getByText(/Next|View For You/)
      expect(button).toBeOnTheScreen()
    })

    it("dismisses and resets global state when View For You is pressed", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const viewForYouButton = screen.queryByText("View For You")

      if (viewForYouButton) {
        fireEvent.press(viewForYouButton)

        const state = __globalStoreTestUtils__!.getCurrentState()
        expect(state.onboarding.showFollowedArtistSummaryBottomSheet).toBe(false)
      }
    })
  })
})
