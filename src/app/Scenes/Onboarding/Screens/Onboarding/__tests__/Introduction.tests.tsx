import { fireEvent, screen } from "@testing-library/react-native"
import { Introduction } from "app/Scenes/Onboarding/Screens/Onboarding/Introduction"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("../Components/QuestionStep", () => {
  const { Text } = require("react-native")
  return {
    QuestionStep: ({ onSelect }: { onSelect: (e: "beginner" | "experienced") => void }) => (
      <>
        <Text onPress={() => onSelect("beginner")}>Select beginner</Text>
        <Text onPress={() => onSelect("experienced")}>Select experienced</Text>
      </>
    ),
  }
})

jest.mock("../Components/BrowsePromptStep", () => {
  const { Text } = require("react-native")
  return {
    BrowsePromptStep: ({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) => (
      <>
        <Text onPress={onNext}>Browse next</Text>
        <Text onPress={onSkip}>Browse skip</Text>
      </>
    ),
  }
})

jest.mock("../Components/ArtworkMontageStep", () => {
  const { Text } = require("react-native")
  return {
    ArtworkMontageStep: ({ onNext }: { onNext: () => void }) => (
      <Text onPress={onNext}>Montage next</Text>
    ),
  }
})

jest.mock("../Components/WelcomeStep", () => {
  const { Text } = require("react-native")
  return {
    WelcomeStep: ({ onNext }: { onNext: () => void }) => <Text onPress={onNext}>Welcome next</Text>,
  }
})

describe("Introduction", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the question step initially", () => {
    renderWithWrappers(<Introduction />)
    expect(screen.getByText("Select beginner")).toBeOnTheScreen()
    expect(screen.getByText("Select experienced")).toBeOnTheScreen()
  })

  describe("beginner path", () => {
    it("routes through BrowsePromptStep → ArtworkMontageStep → WelcomeStep in order", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Select beginner"))
      expect(screen.getByText("Browse next")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Browse next"))
      expect(screen.getByText("Montage next")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Montage next"))
      expect(screen.getByText("Welcome next")).toBeOnTheScreen()
    })

    it("sets onboardingDestination and completes onboarding when done", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Select beginner"))
      fireEvent.press(screen.getByText("Browse next"))
      fireEvent.press(screen.getByText("Montage next"))
      fireEvent.press(screen.getByText("Welcome next"))

      const state = __globalStoreTestUtils__?.getCurrentState()
      expect(state?.onboarding.onboardingDestination).toBe("infinite-discovery")
      expect(state?.onboarding.onboardingState).toBe("complete")
    })

    it("completes onboarding when skipping to home from BrowsePromptStep", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Select beginner"))
      fireEvent.press(screen.getByText("Browse skip"))

      const state = __globalStoreTestUtils__?.getCurrentState()
      expect(state?.onboarding.onboardingState).toBe("complete")
    })
  })

  describe("experienced path", () => {
    it("skips BrowsePromptStep and routes ArtworkMontageStep → WelcomeStep", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Select experienced"))
      expect(screen.getByText("Montage next")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Montage next"))
      expect(screen.getByText("Welcome next")).toBeOnTheScreen()
    })

    it("navigates to FollowArtists when done", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Select experienced"))
      fireEvent.press(screen.getByText("Montage next"))
      fireEvent.press(screen.getByText("Welcome next"))

      expect(mockNavigate).toHaveBeenCalledWith("FollowArtists")
    })
  })
})
