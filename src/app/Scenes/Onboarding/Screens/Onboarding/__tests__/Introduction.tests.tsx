import { ActionType, ContextModule } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { Introduction } from "app/Scenes/Onboarding/Screens/Onboarding/Introduction"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { mockReplace } from "app/utils/tests/navigationMocks"
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
  const actual = jest.requireActual("../Components/WelcomeStep")
  return {
    WelcomeStep: ({ onNext }: { onNext: () => void }) => <Text onPress={onNext}>Welcome next</Text>,
    WelcomeStepScreenQuery: actual.WelcomeStepScreenQuery,
  }
})

describe("Introduction", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows the artwork montage step initially", () => {
    renderWithWrappers(<Introduction />)
    expect(screen.getByText("Montage next")).toBeOnTheScreen()
  })

  it("fires startedOnboarding when it mounts", () => {
    renderWithWrappers(<Introduction />)

    expect(mockTrackEvent).toHaveBeenCalledWith({ action: ActionType.startedOnboarding })
  })

  it("routes through ArtworkMontageStep → WelcomeStep → QuestionStep in order", () => {
    renderWithWrappers(<Introduction />)

    fireEvent.press(screen.getByText("Montage next"))
    expect(screen.getByText("Welcome next")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Welcome next"))
    expect(screen.getByText("Select beginner")).toBeOnTheScreen()
    expect(screen.getByText("Select experienced")).toBeOnTheScreen()
  })

  describe("experienced path", () => {
    it("navigates directly to FollowArtists", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Montage next"))
      fireEvent.press(screen.getByText("Welcome next"))
      fireEvent.press(screen.getByText("Select experienced"))

      expect(mockReplace).toHaveBeenCalledWith("FollowArtists")
    })

    it("tracks the selected answer", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Montage next"))
      fireEvent.press(screen.getByText("Welcome next"))
      fireEvent.press(screen.getByText("Select experienced"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingCollectorLevel,
        data_input: "experienced",
      })
    })
  })

  describe("beginner path", () => {
    it("routes through BrowsePromptStep before navigating to InfiniteDiscovery", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Montage next"))
      fireEvent.press(screen.getByText("Welcome next"))
      fireEvent.press(screen.getByText("Select beginner"))
      expect(screen.getByText("Browse next")).toBeOnTheScreen()

      fireEvent.press(screen.getByText("Browse next"))
      expect(mockReplace).toHaveBeenCalledWith("InfiniteDiscovery")
    })

    it("completes onboarding when skipping from BrowsePromptStep", () => {
      renderWithWrappers(<Introduction />)

      fireEvent.press(screen.getByText("Montage next"))
      fireEvent.press(screen.getByText("Welcome next"))
      fireEvent.press(screen.getByText("Select beginner"))
      fireEvent.press(screen.getByText("Browse skip"))

      const state = __globalStoreTestUtils__?.getCurrentState()
      expect(state?.onboarding.onboardingState).toBe("complete")
      expect(mockTrackEvent).toHaveBeenCalledWith({ action: ActionType.completedOnboarding })
    })
  })
})
