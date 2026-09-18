import { captureMessage } from "@sentry/react-native"
import { act, fireEvent, screen } from "@testing-library/react-native"
import { ArtAssistant } from "app/Scenes/ArtAssistant/ArtAssistant"
import { ART_ASSISTANT_SUGGESTIONS } from "app/Scenes/ArtAssistant/Components/ArtAssistantEmptyState"
import { ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS } from "app/Scenes/ArtAssistant/hooks/useArtAssistantConversation"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { KeyboardController } from "react-native-keyboard-controller"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/ArtAssistant/Components/ArtAssistantArtworkRail", () => ({
  ArtAssistantArtworkRail: () => null,
}))

describe("ArtAssistant", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectState({
      auth: { userID: "user-id", userAccessToken: "access-token" },
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders the empty state and composer", () => {
    renderWithWrappers(<ArtAssistant />)

    expect(screen.getByText("Art Assistant")).toBeOnTheScreen()
    expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-layout")).toBeOnTheScreen()
    expect(screen.queryByRole("button", { name: "Start a new chat" })).not.toBeOnTheScreen()
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

  it("keeps Send disabled when the prompt only has whitespace", () => {
    renderWithWrappers(<ArtAssistant />)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "   ")

    expect(screen.getByLabelText("Send")).toBeDisabled()
  })

  it("highlights the composer while it is focused", () => {
    renderWithWrappers(<ArtAssistant />)

    const composer = screen.getByTestId("art-assistant-composer-input-container")
    const prompt = screen.getByLabelText("Art Assistant prompt")

    expect(composer).toHaveStyle({ borderColor: "#D8D8D8" })

    fireEvent(prompt, "focus")
    expect(composer).toHaveStyle({ borderColor: "#1023D7" })

    fireEvent(prompt, "blur")
    expect(composer).toHaveStyle({ borderColor: "#D8D8D8" })
  })

  it("dismisses the keyboard when the conversation starts scrolling", () => {
    renderWithWrappers(<ArtAssistant />)

    fireEvent(screen.getByTestId("art-assistant-content"), "scrollBeginDrag")

    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
  })

  it("shows activity before publishing the completed response", async () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "  blue painting  ")
    fireEvent.press(screen.getByLabelText("Send"))

    expect(screen.queryByText("What are you looking for?")).not.toBeOnTheScreen()
    expect(screen.getByText("blue painting")).toBeOnTheScreen()
    expect(screen.getByText("Thinking...")).toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    expect(screen.getByLabelText("Send")).toBeDisabled()
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)

    const operation = environment.mock.getMostRecentOperation()

    await act(async () => {
      environment.mock.nextValue(operation, {
        data: {
          aiAgentTurn: {
            __typename: "AIAgentToolCall",
            activity: "SEARCHING_ARTWORKS",
          },
        },
      })
    })

    expect(screen.getByText("Searching artworks...")).toBeOnTheScreen()

    await act(async () => {
      environment.mock.nextValue(operation, {
        data: {
          aiAgentTurn: { __typename: "AIAgentTextDelta", text: "A partial response" },
        },
      })
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
      // No `environment.mock.complete`: the terminal event alone finishes the turn, and the
      // subscription is already disposed by the time the server would close the stream.
    })

    expect(screen.queryByText("Searching artworks...")).not.toBeOnTheScreen()
    expect(screen.getByText("I found a few works for you.")).toBeOnTheScreen()
    expect(screen.getByLabelText("Send")).toBeDisabled()
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
  })

  it("does not dismiss the keyboard again when the user is writing the next prompt", async () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    fireEvent.press(screen.getByLabelText("Send"))
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "show me sculpture next")

    const operation = environment.mock.getMostRecentOperation()

    await act(async () => {
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

    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp(
      "value",
      "show me sculpture next"
    )
  })

  it("waits as long as the agent keeps streaming, then gives up on silence", () => {
    jest.useFakeTimers()

    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    fireEvent.press(screen.getByLabelText("Send"))

    const operation = environment.mock.getMostRecentOperation()
    const timeout = "This is taking longer than expected. Please try again."

    act(() => {
      jest.advanceTimersByTime(ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS - 1)
    })

    expect(screen.queryByText(timeout)).not.toBeOnTheScreen()

    act(() => {
      environment.mock.nextValue(operation, {
        data: {
          aiAgentTurn: { __typename: "AIAgentToolCall", activity: "SEARCHING_ARTWORKS" },
        },
      })
    })

    // The turn is already older than the idle timeout, but the stream proved it is alive.
    act(() => {
      jest.advanceTimersByTime(ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS - 1)
    })

    expect(screen.getByText("Searching artworks...")).toBeOnTheScreen()
    expect(screen.queryByText(timeout)).not.toBeOnTheScreen()

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(screen.getByText(timeout)).toBeOnTheScreen()
    expect(screen.queryByText("Searching artworks...")).not.toBeOnTheScreen()
    expect(captureMessage).toHaveBeenCalledWith(
      "Art Assistant turn: idle_timeout",
      expect.objectContaining({ tags: { artAssistantOutcome: "idle_timeout" } })
    )
  })

  it("frees the composer on the terminal event", () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    fireEvent.press(screen.getByLabelText("Send"))

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      environment.mock.nextValue(operation, {
        data: {
          aiAgentTurn: {
            __typename: "AIAgentTurnComplete",
            message: "I found one work for you.",
            stopReason: "end_turn",
            toolCallCount: 1,
            artworks: [{ internalID: "artwork-id" }],
          },
        },
      })
    })

    expect(screen.getByText("I found one work for you.")).toBeOnTheScreen()

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "something else")

    expect(screen.getByLabelText("Send")).toBeEnabled()
  })

  it("closes the screen", () => {
    const onClose = jest.fn()
    renderWithWrappers(<ArtAssistant onClose={onClose} />)

    fireEvent.press(screen.getByLabelText("Close Art Assistant"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("starts a new chat after confirmation", () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    fireEvent.press(screen.getByLabelText("Send"))
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)

    const firstConversationID =
      environment.mock.getMostRecentOperation().request.variables.input.conversationID

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "red sculpture")
    fireEvent.press(screen.getByRole("button", { name: "Start a new chat" }))

    expect(screen.getByText("Start a new chat?")).toBeOnTheScreen()
    expect(screen.getByText("Your current chat will be lost.")).toBeOnTheScreen()
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(2)

    fireEvent.press(screen.getByTestId("dialog-primary-action-button"))

    expect(screen.queryByText("blue painting")).not.toBeOnTheScreen()
    expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    expect(screen.queryByRole("button", { name: "Start a new chat" })).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "red sculpture")

    fireEvent.press(screen.getByLabelText("Send"))

    const { input } = environment.mock.getMostRecentOperation().request.variables

    expect(input.conversationID).not.toEqual(firstConversationID)
    expect(input.history).toEqual([])
  })

  it("reports the screen view", () => {
    renderWithWrappers(<ArtAssistant />)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_type: "artAssistant",
    })
  })

  it("reports a tapped suggestion with its position", () => {
    renderWithWrappers(<ArtAssistant />)

    fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[1]))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtAssistantSuggestion",
      context_module: "artAssistantSuggestions",
      context_screen_owner_type: "artAssistant",
      position: 1,
      suggestion: ART_ASSISTANT_SUGGESTIONS[1],
    })
  })

  it("reports a sent suggestion as a suggestion", () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))
    fireEvent.press(screen.getByLabelText("Send"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "sentArtAssistantMessage", type: "suggestion" })
    )
  })

  it("reports a suggestion the user rewrote as their own prompt", () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))
    fireEvent.changeText(
      screen.getByLabelText("Art Assistant prompt"),
      `${ART_ASSISTANT_SUGGESTIONS[0]} in blue`
    )
    fireEvent.press(screen.getByLabelText("Send"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "sentArtAssistantMessage", type: "typed" })
    )
  })

  it("keeps the current chat when starting a new chat is canceled", () => {
    const environment = createMockEnvironment()
    renderWithHookWrappersTL(<ArtAssistant />, environment)

    fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    fireEvent.press(screen.getByLabelText("Send"))
    fireEvent.press(screen.getByRole("button", { name: "Start a new chat" }))
    fireEvent.press(screen.getByTestId("dialog-secondary-action-button"))

    expect(screen.getByText("blue painting")).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "Start a new chat" })).toBeOnTheScreen()
  })
})
