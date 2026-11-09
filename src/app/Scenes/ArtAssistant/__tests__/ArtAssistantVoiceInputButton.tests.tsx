import { fireEvent, screen } from "@testing-library/react-native"
import { ArtAssistantVoiceInputButton } from "app/Scenes/ArtAssistant/Components/ArtAssistantVoiceInputButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SharedValue, useReducedMotion } from "react-native-reanimated"

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useReducedMotion: jest.fn(),
}))

const loudVolume = { get: () => 1 } as SharedValue<number>

const ringScales = () =>
  screen
    .getAllByTestId("art-assistant-voice-input-ring")
    .map(
      (ring) => ring.props.style.flat().find((style: any) => style?.transform).transform[0].scale
    )

describe("ArtAssistantVoiceInputButton", () => {
  beforeEach(() => {
    jest.mocked(useReducedMotion).mockReturnValue(false)
  })

  it("shows the microphone and starts dictation", () => {
    const onPress = jest.fn()
    renderWithWrappers(
      <ArtAssistantVoiceInputButton
        isHearing={false}
        isListening={false}
        onPress={onPress}
        volume={loudVolume}
      />
    )

    fireEvent.press(screen.getByRole("button", { name: "Dictate a prompt" }))

    expect(onPress).toHaveBeenCalled()
    expect(screen.queryByTestId("art-assistant-voice-input-ring")).not.toBeOnTheScreen()
  })

  it("shows the stop button without rings while the recognizer starts", () => {
    renderWithWrappers(
      <ArtAssistantVoiceInputButton
        isHearing={false}
        isListening
        onPress={jest.fn()}
        volume={loudVolume}
      />
    )

    expect(screen.getByRole("button", { name: "Stop dictation" })).toBeOnTheScreen()
    expect(screen.queryByTestId("art-assistant-voice-input-ring")).not.toBeOnTheScreen()
  })

  it("spreads the rings with the volume", () => {
    renderWithWrappers(
      <ArtAssistantVoiceInputButton isHearing isListening onPress={jest.fn()} volume={loudVolume} />
    )

    expect(ringScales()).toEqual([1.35, 1.6])
  })

  it("keeps the rings still with Reduce Motion on", () => {
    jest.mocked(useReducedMotion).mockReturnValue(true)
    renderWithWrappers(
      <ArtAssistantVoiceInputButton isHearing isListening onPress={jest.fn()} volume={loudVolume} />
    )

    expect(ringScales()).toEqual([1.12, 1.12])
  })
})
