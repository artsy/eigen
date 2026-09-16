import { act, fireEvent, screen } from "@testing-library/react-native"
import { ART_ASSISTANT_SUGGESTIONS, ArtAssistant } from "app/Scenes/ArtAssistant/ArtAssistant"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtAssistant", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      auth: { userID: "user-id", userAccessToken: "access-token" },
    })
  })

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
    expect(screen.getByLabelText("Send")).toBeEnabled()
  })

  it("enables Send when the prompt has text", () => {
    renderWithWrappers(<ArtAssistant />)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "  blue painting  ")

    expect(screen.getByLabelText("Send")).toBeEnabled()
  })

  it("shows the response from Metaphysics", () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    fireEvent.press(screen.getByLabelText("Send"))

    expect(screen.getByText("Thinking...")).toBeOnTheScreen()

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      environment.mock.nextValue(operation, {
        data: {
          aiAgentTurn: {
            __typename: "AIAgentTurnComplete",
            message: "I found a few works for you.",
            stopReason: "end_turn",
            toolCallCount: 1,
            artworks: [],
          },
        },
      })
    })

    // The terminal application event is enough; the server does not need to close the stream.
    expect(screen.getByText("I found a few works for you.")).toBeOnTheScreen()
    expect(screen.getByLabelText("Send")).toBeDisabled()
  })

  it("closes the screen", () => {
    const onClose = jest.fn()
    renderWithWrappers(<ArtAssistant onClose={onClose} />)

    fireEvent.press(screen.getByLabelText("Close Art Assistant"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
