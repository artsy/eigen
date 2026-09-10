import { fireEvent, screen } from "@testing-library/react-native"
import { ART_ASSISTANT_SUGGESTIONS, ArtAssistant } from "app/Scenes/ArtAssistant/ArtAssistant"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ArtAssistant", () => {
  it("renders the empty state and composer", () => {
    renderWithWrappers(<ArtAssistant />)

    expect(screen.getByText("Art Assistant")).toBeOnTheScreen()
    expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-layout")).toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toBeOnTheScreen()
    expect(screen.getByLabelText("Send")).toBeDisabled()

    ART_ASSISTANT_SUGGESTIONS.forEach((suggestion) => {
      expect(screen.getByText(suggestion)).toBeOnTheScreen()
    })
  })

  it("fills the prompt from a suggestion", () => {
    renderWithWrappers(<ArtAssistant />)

    fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))

    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp(
      "value",
      ART_ASSISTANT_SUGGESTIONS[0]
    )
    expect(screen.getByLabelText("Send")).toBeDisabled()
  })

  it("keeps Send disabled until sending is implemented", () => {
    renderWithWrappers(<ArtAssistant />)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "  blue painting  ")

    expect(screen.getByLabelText("Send")).toBeDisabled()
  })

  it("closes the screen", () => {
    const onClose = jest.fn()
    renderWithWrappers(<ArtAssistant onClose={onClose} />)

    fireEvent.press(screen.getByLabelText("Close Art Assistant"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
