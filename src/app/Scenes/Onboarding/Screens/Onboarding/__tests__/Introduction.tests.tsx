import { ActionType, ContextModule } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { Introduction } from "app/Scenes/Onboarding/Screens/Onboarding/Introduction"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { mockNavigate, mockReplace } from "app/utils/tests/navigationMocks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("../Components/QuestionStep", () => {
  const { Text } = require("react-native")
  return {
    QuestionStep: ({
      onSelect,
    }: {
      onSelect: (experience: "beginner" | "experienced", label: string) => void
    }) => (
      <>
        <Text onPress={() => onSelect("beginner", "Select beginner")}>Select beginner</Text>
        <Text onPress={() => onSelect("experienced", "Select experienced")}>
          Select experienced
        </Text>
      </>
    ),
  }
})

jest.mock("../Components/BrowsePromptStep", () => {
  const { Text } = require("react-native")
  return {
    BrowsePromptStep: ({ onNext }: { onNext: () => void }) => (
      <Text onPress={onNext}>Browse next</Text>
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

  it("shows the artwork montage step initially", async () => {
    await renderWithWrappers(<Introduction />)
    expect(screen.getByText("Montage next")).toBeOnTheScreen()
  })

  it("fires startedOnboarding when it mounts", async () => {
    await renderWithWrappers(<Introduction />)

    expect(mockTrackEvent).toHaveBeenCalledWith({ action: ActionType.startedOnboarding })
  })

  it("routes through ArtworkMontageStep → WelcomeStep → QuestionStep in order", async () => {
    await renderWithWrappers(<Introduction />)

    await fireEvent.press(screen.getByText("Montage next"))
    expect(screen.getByText("Welcome next")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Welcome next"))
    expect(screen.getByText("Select beginner")).toBeOnTheScreen()
    expect(screen.getByText("Select experienced")).toBeOnTheScreen()
  })

  describe("experienced path", () => {
    it("navigates directly to FollowArtists", async () => {
      await renderWithWrappers(<Introduction />)

      await fireEvent.press(screen.getByText("Montage next"))
      await fireEvent.press(screen.getByText("Welcome next"))
      await fireEvent.press(screen.getByText("Select experienced"))

      expect(mockReplace).toHaveBeenCalledWith("FollowArtists")
    })

    it("tracks the selected answer", async () => {
      await renderWithWrappers(<Introduction />)

      await fireEvent.press(screen.getByText("Montage next"))
      await fireEvent.press(screen.getByText("Welcome next"))
      await fireEvent.press(screen.getByText("Select experienced"))

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: ActionType.onboardingUserInputData,
        context_module: ContextModule.onboardingCollectorLevel,
        data_input: "Select experienced",
      })
    })
  })

  describe("beginner path", () => {
    it("routes through BrowsePromptStep before navigating to InfiniteDiscovery", async () => {
      await renderWithWrappers(<Introduction />)

      await fireEvent.press(screen.getByText("Montage next"))
      await fireEvent.press(screen.getByText("Welcome next"))
      await fireEvent.press(screen.getByText("Select beginner"))
      expect(screen.getByText("Browse next")).toBeOnTheScreen()

      await fireEvent.press(screen.getByText("Browse next"))
      expect(mockNavigate).toHaveBeenCalledWith("InfiniteDiscovery")
    })
  })
})
