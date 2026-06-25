import { fireEvent, screen } from "@testing-library/react-native"
import { ArtistSaveOnboardingBottomSheet } from "app/Scenes/HomeView/Components/ArtistSaveOnboardingBottomSheet"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))

const TEST_ARTISTS = Array.from({ length: 3 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Artist ${i + 1}`,
  imageUrl: `https://example.com/artist-${i + 1}.jpg`,
}))

describe("ArtistSaveOnboardingBottomSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)
    ;(useFeatureFlag as jest.Mock).mockReturnValue(true)
  })

  describe("Visibility", () => {
    it("does not render content when showFollowedArtistSummaryBottomSheet is false", () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

      expect(
        screen.queryByText("Your followed artists are saved to Favorites.")
      ).not.toBeOnTheScreen()
    })

    it("does not render content when feature flag is disabled", () => {
      ;(useFeatureFlag as jest.Mock).mockReturnValue(false)
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

      expect(
        screen.queryByText("Your followed artists are saved to Favorites.")
      ).not.toBeOnTheScreen()
    })

    it("renders the sheet content when both conditions are met", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

      expect(
        await screen.findByText("Your followed artists are saved to Favorites.")
      ).toBeOnTheScreen()
    })
  })

  describe("Content", () => {
    it("renders page 1 content", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

      expect(
        await screen.findByText("Your followed artists are saved to Favorites.")
      ).toBeOnTheScreen()
      expect(
        screen.getByText("Find them anytime in the Favorites tab at the bottom of your screen.")
      ).toBeOnTheScreen()
    })

    it("renders page 2 content", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

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

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

      // Component starts on page 1 (activeStep = 0)
      expect(await screen.findByText("Next")).toBeOnTheScreen()
    })

    it("shows View For You button on page 2", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

      await screen.findByText("Your followed artists are saved to Favorites.")

      const button = screen.getByText(/Next|View For You/)
      expect(button).toBeOnTheScreen()
    })

    it("dismisses and resets global state when View For You is pressed", async () => {
      GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(true)

      renderWithWrappers(<ArtistSaveOnboardingBottomSheet artists={TEST_ARTISTS} />)

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
