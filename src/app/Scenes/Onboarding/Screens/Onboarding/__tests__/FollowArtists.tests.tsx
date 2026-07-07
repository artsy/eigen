import { ActionType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { FollowArtists } from "app/Scenes/Onboarding/Screens/Onboarding/FollowArtists"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { KeyboardController } from "react-native-keyboard-controller"

// Extend the global mock rather than replace it — replacing it drops KeyboardAwareScrollView
// which BottomSheetKeyboardAwareScrollView depends on.
jest.mock("react-native-keyboard-controller", () => ({
  ...require("react-native-keyboard-controller/jest"),
  KeyboardStickyView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock("app/utils/hooks/useDebouncedValue", () => ({
  useDebouncedValue: ({ value }: { value: string }) => ({ debouncedValue: value }),
}))

jest.mock("app/Scenes/Onboarding/Screens/Onboarding/Components/FollowedArtistsBank", () => ({
  FollowedArtistsBank: () => null,
}))

jest.mock("app/Scenes/Onboarding/Screens/Onboarding/Components/FollowArtistsOrderedSet", () => {
  const { Text } = require("react-native")
  return {
    FollowArtistsOrderedSetScreen: () => <Text>OrderedSet</Text>,
  }
})

jest.mock("app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingSearchResults", () => {
  const { Text } = require("react-native")
  return {
    OnboardingSearchResultsScreen: () => <Text>SearchResults</Text>,
  }
})

describe("FollowArtists", () => {
  let dismissSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    dismissSpy = jest.spyOn(KeyboardController, "dismiss").mockImplementation(jest.fn())
  })

  describe("default view", () => {
    it("shows the ordered set and hides search results", () => {
      renderWithWrappers(<FollowArtists />)

      expect(screen.getByText("OrderedSet")).toBeOnTheScreen()
      expect(screen.queryByText("SearchResults")).not.toBeOnTheScreen()
    })

    it("does not show the Cancel button when there is no query", () => {
      renderWithWrappers(<FollowArtists />)

      expect(screen.queryByText("Cancel")).not.toBeOnTheScreen()
    })
  })

  describe("search", () => {
    it("shows search results and hides ordered set when query has 2+ chars", () => {
      renderWithWrappers(<FollowArtists />)

      fireEvent.changeText(screen.getByPlaceholderText("Search Artists"), "Ba")

      expect(screen.getByText("SearchResults")).toBeOnTheScreen()
      expect(screen.queryByText("OrderedSet")).not.toBeOnTheScreen()
    })

    it("does not show search results for a single character query", () => {
      renderWithWrappers(<FollowArtists />)

      fireEvent.changeText(screen.getByPlaceholderText("Search Artists"), "B")

      expect(screen.queryByText("SearchResults")).not.toBeOnTheScreen()
      expect(screen.getByText("OrderedSet")).toBeOnTheScreen()
    })

    it("shows Cancel button when query is non-empty", () => {
      renderWithWrappers(<FollowArtists />)

      fireEvent.changeText(screen.getByPlaceholderText("Search Artists"), "Banksy")

      expect(screen.getByText("Cancel")).toBeOnTheScreen()
    })

    it("pressing Cancel clears the query and returns to ordered set", () => {
      renderWithWrappers(<FollowArtists />)

      fireEvent.changeText(screen.getByPlaceholderText("Search Artists"), "Banksy")
      expect(screen.getByText("SearchResults")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Cancel"))

      expect(screen.queryByText("SearchResults")).not.toBeOnTheScreen()
      expect(screen.getByText("OrderedSet")).toBeOnTheScreen()
      expect(screen.queryByText("Cancel")).not.toBeOnTheScreen()
    })

    it("pressing Cancel dismisses the keyboard", () => {
      renderWithWrappers(<FollowArtists />)

      fireEvent.changeText(screen.getByPlaceholderText("Search Artists"), "Banksy")
      fireEvent.press(screen.getByText("Cancel"))

      expect(dismissSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("progress badge", () => {
    it("shows 0/3 initially", () => {
      renderWithWrappers(<FollowArtists />)

      expect(screen.getByText("0/3")).toBeOnTheScreen()
    })

    it("reflects the number of followed artists from the store", () => {
      __globalStoreTestUtils__?.injectState({
        onboarding: {
          followedOnboardingArtists: [
            { internalID: "1", imageUrl: null, blurhash: null },
            { internalID: "2", imageUrl: null, blurhash: null },
          ],
        },
      })

      renderWithWrappers(<FollowArtists />)

      expect(screen.getByText("2/3")).toBeOnTheScreen()
    })

    it("caps badge display at 3/3 even with more than 3 followed artists", () => {
      __globalStoreTestUtils__?.injectState({
        onboarding: {
          followedOnboardingArtists: [
            { internalID: "1", imageUrl: null, blurhash: null },
            { internalID: "2", imageUrl: null, blurhash: null },
            { internalID: "3", imageUrl: null, blurhash: null },
            { internalID: "4", imageUrl: null, blurhash: null },
          ],
        },
      })

      renderWithWrappers(<FollowArtists />)

      expect(screen.getByText("3/3")).toBeOnTheScreen()
    })
  })

  describe("Continue button", () => {
    it("is disabled when fewer than 3 artists are followed", () => {
      __globalStoreTestUtils__?.injectState({
        onboarding: {
          followedOnboardingArtists: [
            { internalID: "1", imageUrl: null, blurhash: null },
            { internalID: "2", imageUrl: null, blurhash: null },
          ],
        },
      })

      renderWithWrappers(<FollowArtists />)

      expect(screen.getByText("Continue to Artsy")).toBeDisabled()
    })

    it("is enabled when 3 or more artists are followed", () => {
      __globalStoreTestUtils__?.injectState({
        onboarding: {
          followedOnboardingArtists: [
            { internalID: "1", imageUrl: null, blurhash: null },
            { internalID: "2", imageUrl: null, blurhash: null },
            { internalID: "3", imageUrl: null, blurhash: null },
          ],
        },
      })

      renderWithWrappers(<FollowArtists />)

      expect(screen.getByText("Continue to Artsy")).not.toBeDisabled()
    })

    it("sets onboardingState to complete when pressed", () => {
      __globalStoreTestUtils__?.injectState({
        onboarding: {
          followedOnboardingArtists: [
            { internalID: "1", imageUrl: null, blurhash: null },
            { internalID: "2", imageUrl: null, blurhash: null },
            { internalID: "3", imageUrl: null, blurhash: null },
          ],
        },
      })

      renderWithWrappers(<FollowArtists />)

      fireEvent.press(screen.getByText("Continue to Artsy"))

      expect(__globalStoreTestUtils__?.getCurrentState().onboarding.onboardingState).toBe(
        "complete"
      )
      expect(mockTrackEvent).toHaveBeenCalledWith({ action: ActionType.completedOnboarding })
    })
  })

  describe("Skip button", () => {
    it("sets onboardingState to complete", () => {
      renderWithWrappers(<FollowArtists />)

      fireEvent.press(screen.getByLabelText("Skip new user onboarding"))

      expect(__globalStoreTestUtils__?.getCurrentState().onboarding.onboardingState).toBe(
        "complete"
      )
      expect(mockTrackEvent).toHaveBeenCalledWith({ action: ActionType.completedOnboarding })
    })
  })
})
