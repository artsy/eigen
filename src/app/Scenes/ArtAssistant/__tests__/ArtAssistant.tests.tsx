import { captureMessage } from "@sentry/react-native"
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react-native"
import { ArtAssistant } from "app/Scenes/ArtAssistant/ArtAssistant"
import { ART_ASSISTANT_SUGGESTIONS } from "app/Scenes/ArtAssistant/Components/ArtAssistantEmptyState"
import { ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS } from "app/Scenes/ArtAssistant/hooks/useArtAssistantConversation"
import {
  ArtAssistantImageAttachment,
  useArtAssistantImageAttachment,
} from "app/Scenes/ArtAssistant/hooks/useArtAssistantImageAttachment"
import { ART_ASSISTANT_ERRORS } from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL, renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition"
import { KeyboardController } from "react-native-keyboard-controller"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/ArtAssistant/Components/ArtAssistantArtworkGrid", () => ({
  ArtAssistantArtworkGrid: () => null,
}))
jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  useReducedMotion: jest.fn(() => false),
}))
jest.mock("app/Scenes/ArtAssistant/hooks/useArtAssistantImageAttachment", () => ({
  useArtAssistantImageAttachment: jest.fn(),
}))

// The palette `Dialog` starts a fade-out on mount, and when that fade-out is interrupted by the
// fade-in it hides the dialog again. Let the mount animation finish, as it would for a real user,
// before opening the dialog.
const finishDialogMountAnimation = async () => {
  await act(() => {
    jest.advanceTimersByTime(1000)
  })
}

const mockPickImage = jest.fn()
const mockRemoveImage = jest.fn()

const mockImageAttachment = (attachment: ArtAssistantImageAttachment | null) =>
  jest.mocked(useArtAssistantImageAttachment).mockReturnValue({
    attachment,
    pick: mockPickImage,
    remove: mockRemoveImage,
  })

describe("ArtAssistant", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockImageAttachment(null)
    __globalStoreTestUtils__?.injectState({
      auth: { userID: "user-id", userAccessToken: "access-token" },
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders the empty state and composer", async () => {
    await renderWithWrappers(<ArtAssistant />)

    expect(screen.getByText("Art Assistant")).toBeOnTheScreen()
    expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-layout")).toBeOnTheScreen()
    expect(screen.queryByRole("button", { name: "Start a new chat" })).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toBeOnTheScreen()
    expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
    expect(screen.getByText("Art Assistant is AI and can make mistakes")).toBeOnTheScreen()

    ART_ASSISTANT_SUGGESTIONS.forEach((suggestion) => {
      expect(screen.getByText(suggestion)).toBeOnTheScreen()
    })
  })

  it("prefills the composer with the initial prompt without sending it", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant initialPrompt="moody seascapes" />, environment)

    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "moody seascapes")
    expect(screen.getByLabelText("Send")).toBeEnabled()
    expect(screen.queryByTestId("art-assistant-user-message")).not.toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(0)
  })

  it("sends the initial prompt as soon as the screen opens when asked to", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(
      <ArtAssistant initialPrompt="moody seascapes" sendInitialPrompt />,
      environment
    )

    expect(screen.getByText("moody seascapes")).toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-user-message")).toBeOnTheScreen()
    expect(screen.getByText("Thinking...")).toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    expect(environment.mock.getAllOperations()).toHaveLength(1)
    expect(environment.mock.getMostRecentOperation().request.variables.input).toEqual(
      expect.objectContaining({ message: "moody seascapes" })
    )
  })

  it("does not send the initial prompt when the flag comes from a URL query param", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(
      // @ts-expect-error URL query params reach the screen as strings
      <ArtAssistant initialPrompt="moody seascapes" sendInitialPrompt="true" />,
      environment
    )

    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "moody seascapes")
    expect(screen.queryByTestId("art-assistant-user-message")).not.toBeOnTheScreen()
    expect(environment.mock.getAllOperations()).toHaveLength(0)
  })

  it("renders an empty composer when the initial prompt is a bare URL query param", async () => {
    // @ts-expect-error a bare `?initialPrompt` is parsed as null
    await renderWithWrappers(<ArtAssistant initialPrompt={null} />)

    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
  })

  it("sends a suggestion as soon as it is picked", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))

    expect(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0])).toBeOnTheScreen()
    expect(screen.getByTestId("art-assistant-user-message")).toBeOnTheScreen()
    expect(screen.getByText("Thinking...")).toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    expect(environment.mock.getMostRecentOperation().request.variables.input).toEqual(
      expect.objectContaining({ message: ART_ASSISTANT_SUGGESTIONS[0] })
    )
  })

  it("sends a suggested reply from the latest answer as soon as it is picked", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")
    await fireEvent.press(screen.getByLabelText("Send"))

    await act(async () => {
      environment.mock.nextValue(environment.mock.getMostRecentOperation(), {
        data: {
          aiAgentTurn: {
            __typename: "AIAgentTurnComplete",
            message: "Here are a few.",
            stopReason: "end_turn",
            toolCallCount: 1,
            artworks: [],
            suggestedReplies: [{ text: "Show me cheaper ones" }, { text: "Only paintings" }],
          },
        },
      })
    })

    await fireEvent.press(screen.getByText("Only paintings"))

    expect(environment.mock.getMostRecentOperation().request.variables.input).toEqual(
      expect.objectContaining({ message: "Only paintings" })
    )
    expect(screen.queryByText("Show me cheaper ones")).not.toBeOnTheScreen()
  })

  it("reports a tapped suggested reply with its position and the answer that offered it", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")
    await fireEvent.press(screen.getByLabelText("Send"))

    await act(async () => {
      environment.mock.nextValue(environment.mock.getMostRecentOperation(), {
        data: {
          aiAgentTurn: {
            __typename: "AIAgentTurnComplete",
            message: "Here are a few.",
            stopReason: "end_turn",
            toolCallCount: 1,
            artworks: [],
            suggestedReplies: [{ text: "Show me cheaper ones" }, { text: "Only paintings" }],
          },
        },
      })
    })

    await fireEvent.press(screen.getByText("Only paintings"))

    const event = (action: string) =>
      mockTrackEvent.mock.calls
        .map(([call]) => call as Record<string, any>)
        .find((call) => call.action === action)
    const tapped = event("tappedArtAssistantSuggestedReply")

    expect(tapped).toEqual(
      expect.objectContaining({
        context_module: "artAssistantSuggestedReplies",
        context_screen_owner_type: "artAssistant",
        position: 1,
      })
    )
    expect(tapped?.conversation_id).toEqual(event("sentArtAssistantMessage")?.conversation_id)
    expect(tapped?.response_message_id).toEqual(event("receivedArtAssistantResponse")?.message_id)
  })

  it("enables Send when the prompt has text", async () => {
    await renderWithWrappers(<ArtAssistant />)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "  blue painting  ")

    expect(screen.getByLabelText("Send")).toBeEnabled()
  })

  it("keeps Send disabled when the prompt only has whitespace", async () => {
    await renderWithWrappers(<ArtAssistant />)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "   ")

    expect(screen.getByLabelText("Send")).toBeDisabled()
  })

  it("keeps the composer to one row, with the AI notice, until there is something to send", async () => {
    await renderWithWrappers(<ArtAssistant />)

    expect(screen.getByText("Art Assistant is AI and can make mistakes")).toBeOnTheScreen()
    expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")

    expect(screen.queryByText("Art Assistant is AI and can make mistakes")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Send")).toBeEnabled()

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "")

    expect(screen.getByText("Art Assistant is AI and can make mistakes")).toBeOnTheScreen()
    expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
  })

  describe("expanding the composer", () => {
    it("expands while it is focused, and collapses on blur when empty", async () => {
      await renderWithWrappers(<ArtAssistant />)

      const prompt = screen.getByLabelText("Art Assistant prompt")
      expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
      expect(screen.getByText("Art Assistant is AI and can make mistakes")).toBeOnTheScreen()

      await fireEvent(prompt, "focus")

      expect(screen.getByLabelText("Send")).toBeDisabled()
      expect(screen.queryByText("Art Assistant is AI and can make mistakes")).not.toBeOnTheScreen()

      await fireEvent(prompt, "blur")

      expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
      expect(screen.getByText("Art Assistant is AI and can make mistakes")).toBeOnTheScreen()
    })

    it("stays expanded after blur while there is text", async () => {
      await renderWithWrappers(<ArtAssistant />)

      const prompt = screen.getByLabelText("Art Assistant prompt")

      await fireEvent(prompt, "focus")
      await fireEvent.changeText(prompt, "Warhol prints")
      await fireEvent(prompt, "blur")

      expect(screen.getByLabelText("Send")).toBeEnabled()
      expect(screen.queryByText("Art Assistant is AI and can make mistakes")).not.toBeOnTheScreen()
    })
  })

  it("dismisses the keyboard when the conversation starts scrolling", async () => {
    await renderWithWrappers(<ArtAssistant />)

    await fireEvent(screen.getByTestId("art-assistant-content"), "scrollBeginDrag")

    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
  })

  it("shows activity before publishing the completed response", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "  blue painting  ")
    await fireEvent.press(screen.getByLabelText("Send"))

    expect(screen.queryByText("What are you looking for?")).not.toBeOnTheScreen()
    expect(screen.getByText("blue painting")).toBeOnTheScreen()
    expect(screen.getByText("Thinking...")).toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
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
    expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
  })

  it("does not dismiss the keyboard again when the user is writing the next prompt", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    await fireEvent.press(screen.getByLabelText("Send"))
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)
    await fireEvent.changeText(
      screen.getByLabelText("Art Assistant prompt"),
      "show me sculpture next"
    )

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

  it("waits as long as the agent keeps streaming, then gives up on silence", async () => {
    jest.useFakeTimers()

    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    await fireEvent.press(screen.getByLabelText("Send"))

    const operation = environment.mock.getMostRecentOperation()
    const timeout = ART_ASSISTANT_ERRORS.timeout.message

    await act(() => {
      jest.advanceTimersByTime(ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS - 1)
    })

    expect(screen.queryByText(timeout)).not.toBeOnTheScreen()

    await act(() => {
      environment.mock.nextValue(operation, {
        data: {
          aiAgentTurn: { __typename: "AIAgentToolCall", activity: "SEARCHING_ARTWORKS" },
        },
      })
    })

    // The turn is already older than the idle timeout, but the stream proved it is alive.
    await act(() => {
      jest.advanceTimersByTime(ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS - 1)
    })

    expect(screen.getByText("Searching artworks...")).toBeOnTheScreen()
    expect(screen.queryByText(timeout)).not.toBeOnTheScreen()

    await act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(screen.getByText(timeout)).toBeOnTheScreen()
    expect(screen.queryByText("Searching artworks...")).not.toBeOnTheScreen()
    expect(captureMessage).toHaveBeenCalledWith(
      "Art Assistant turn: idle_timeout",
      expect.objectContaining({ tags: { artAssistantOutcome: "idle_timeout" } })
    )
  })

  it("frees the composer on the terminal event", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    await fireEvent.press(screen.getByLabelText("Send"))

    const operation = environment.mock.getMostRecentOperation()

    await act(() => {
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

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "something else")

    expect(screen.getByLabelText("Send")).toBeEnabled()
  })

  it("closes the screen", async () => {
    const onClose = jest.fn()
    await renderWithWrappers(<ArtAssistant onClose={onClose} />)

    await fireEvent.press(screen.getByLabelText("Close Art Assistant"))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("starts a new chat after confirmation", async () => {
    jest.useFakeTimers()
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)
    await finishDialogMountAnimation()

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    await fireEvent.press(screen.getByLabelText("Send"))
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(1)

    const firstConversationID =
      environment.mock.getMostRecentOperation().request.variables.input.conversationID

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "red sculpture")
    await fireEvent.press(screen.getByRole("button", { name: "Start a new chat" }))

    expect(screen.getByText("Start a new chat?")).toBeOnTheScreen()
    expect(screen.getByText("Your current chat will be lost.")).toBeOnTheScreen()
    expect(KeyboardController.dismiss).toHaveBeenCalledTimes(2)

    await fireEvent.press(screen.getByTestId("dialog-primary-action-button"))

    expect(screen.queryByText("blue painting")).not.toBeOnTheScreen()
    expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    expect(screen.queryByRole("button", { name: "Start a new chat" })).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "red sculpture")

    await fireEvent.press(screen.getByLabelText("Send"))

    const { input } = environment.mock.getMostRecentOperation().request.variables

    expect(input.conversationID).not.toEqual(firstConversationID)
    expect(input.history).toEqual([])
  })

  describe("error actions", () => {
    const sendAndFail = async (
      environment: ReturnType<typeof createMockEnvironment>,
      stopReason: string
    ) => {
      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
      await fireEvent.press(screen.getByLabelText("Send"))

      await act(() => {
        environment.mock.nextValue(environment.mock.getMostRecentOperation(), {
          data: {
            aiAgentTurn: {
              __typename: "AIAgentTurnComplete",
              message: null,
              stopReason,
              toolCallCount: 0,
              artworks: null,
            },
          },
        })
      })
    }

    it("asks the same prompt again", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await sendAndFail(environment, "max_iterations")

      expect(screen.getByText(ART_ASSISTANT_ERRORS.timeout.message)).toBeOnTheScreen()

      await fireEvent.press(screen.getByText("Try the same ask again"))

      expect(environment.mock.getMostRecentOperation().request.variables.input).toEqual(
        expect.objectContaining({ message: "blue painting", history: [] })
      )
      expect(screen.getAllByTestId("art-assistant-user-message")).toHaveLength(1)
      expect(screen.queryByText(ART_ASSISTANT_ERRORS.timeout.message)).not.toBeOnTheScreen()
    })

    it("hides the actions when the collector would rather ask something else", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await sendAndFail(environment, "max_iterations")
      await fireEvent.press(screen.getByText("Forget it, I'll ask something else"))

      expect(screen.getByText(ART_ASSISTANT_ERRORS.timeout.message)).toBeOnTheScreen()
      expect(screen.queryByTestId("art-assistant-error-actions")).not.toBeOnTheScreen()
    })

    it("starts a new chat without asking for confirmation again", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await sendAndFail(environment, "error")
      await fireEvent.press(screen.getByText("Start a new chat instead"))

      expect(screen.queryByText("Start a new chat?")).not.toBeOnTheScreen()
      expect(screen.queryByText("blue painting")).not.toBeOnTheScreen()
      expect(screen.getByText("What are you looking for?")).toBeOnTheScreen()
    })

    it("offers nothing to tap when the collector ran out of turns", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await sendAndFail(environment, "rate_limited")

      expect(screen.getByText(ART_ASSISTANT_ERRORS.rate_limited.message)).toBeOnTheScreen()
      expect(screen.queryByTestId("art-assistant-error-actions")).not.toBeOnTheScreen()
    })
  })

  it("reports the screen view", async () => {
    await renderWithWrappers(<ArtAssistant />)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "screen",
      context_screen_owner_type: "artAssistant",
    })
  })

  it("reports a tapped suggestion with its position", async () => {
    await renderWithWrappers(<ArtAssistant />)

    await fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[1]))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtAssistantSuggestion",
      context_module: "artAssistantSuggestions",
      context_screen_owner_type: "artAssistant",
      position: 1,
      suggestion: ART_ASSISTANT_SUGGESTIONS[1],
    })
  })

  it("reports a sent suggestion as a suggestion", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "sentArtAssistantMessage", type: "suggestion" })
    )
  })

  it("reports a prompt the user wrote as their own prompt", async () => {
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    await fireEvent.press(screen.getByLabelText("Send"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "sentArtAssistantMessage", type: "typed" })
    )
  })

  it("keeps the current chat when starting a new chat is canceled", async () => {
    jest.useFakeTimers()
    const environment = createMockEnvironment()
    await renderWithHookWrappersTL(<ArtAssistant />, environment)
    await finishDialogMountAnimation()

    await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "blue painting")
    await fireEvent.press(screen.getByLabelText("Send"))
    await fireEvent.press(screen.getByRole("button", { name: "Start a new chat" }))
    await fireEvent.press(screen.getByTestId("dialog-secondary-action-button"))

    expect(screen.getByText("blue painting")).toBeOnTheScreen()
    expect(screen.getByRole("button", { name: "Start a new chat" })).toBeOnTheScreen()
  })

  describe("image attachment", () => {
    const image = { s3Bucket: "bucket", s3Key: "key", uri: "file:///photo.jpg" }

    it("hides the camera button while image input is off", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtAssistantImageSearch: false })
      await renderWithWrappers(<ArtAssistant />)

      expect(screen.queryByRole("button", { name: "Add an image" })).not.toBeOnTheScreen()
    })

    it("opens the photo picker from the camera button", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtAssistantImageSearch: true })
      await renderWithWrappers(<ArtAssistant />)

      await fireEvent.press(screen.getByRole("button", { name: "Add an image" }))

      expect(mockPickImage).toHaveBeenCalled()
    })

    it("keeps Send disabled while the image uploads", async () => {
      mockImageAttachment({ status: "uploading", uri: image.uri })
      await renderWithWrappers(<ArtAssistant />)

      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "like this")

      expect(screen.getByTestId("art-assistant-image-uploading")).toBeOnTheScreen()
      expect(screen.getByLabelText("Send")).toBeDisabled()
    })

    it("tells screen readers whether the image is still uploading", async () => {
      mockImageAttachment({ status: "uploading", uri: image.uri })
      const { rerender } = await renderWithWrappers(<ArtAssistant />)

      expect(screen.getByLabelText("Uploading image")).toBeOnTheScreen()

      mockImageAttachment({ status: "ready", uri: image.uri, image })
      await rerender(<ArtAssistant />)

      expect(screen.getByLabelText("Image to send")).toBeOnTheScreen()
      expect(screen.queryByLabelText("Uploading image")).not.toBeOnTheScreen()
    })

    it("sends an uploaded image with a tapped suggested reply", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")
      await fireEvent.press(screen.getByLabelText("Send"))

      // The collector attaches an image while the answer is on its way.
      mockImageAttachment({ status: "ready", uri: image.uri, image })

      await act(async () => {
        environment.mock.nextValue(environment.mock.getMostRecentOperation(), {
          data: {
            aiAgentTurn: {
              __typename: "AIAgentTurnComplete",
              message: "Here are a few.",
              stopReason: "end_turn",
              toolCallCount: 1,
              artworks: [],
              suggestedReplies: [{ text: "Show me cheaper ones" }],
            },
          },
        })
      })

      await fireEvent.press(screen.getByText("Show me cheaper ones"))

      expect(environment.mock.getMostRecentOperation().request.variables.input).toMatchObject({
        message: "Show me cheaper ones",
        image: { s3Bucket: "bucket", s3Key: "key" },
      })
      expect(mockRemoveImage).toHaveBeenCalled()
    })

    it("does not send a suggested reply while the image uploads", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")
      await fireEvent.press(screen.getByLabelText("Send"))

      mockImageAttachment({ status: "uploading", uri: image.uri })

      await act(async () => {
        environment.mock.nextValue(environment.mock.getMostRecentOperation(), {
          data: {
            aiAgentTurn: {
              __typename: "AIAgentTurnComplete",
              message: "Here are a few.",
              stopReason: "end_turn",
              toolCallCount: 1,
              artworks: [],
              suggestedReplies: [{ text: "Show me cheaper ones" }],
            },
          },
        })
      })

      const operationCount = environment.mock.getAllOperations().length

      await fireEvent.press(screen.getByText("Show me cheaper ones"))

      expect(environment.mock.getAllOperations()).toHaveLength(operationCount)
      expect(mockRemoveImage).not.toHaveBeenCalled()
    })

    it("sends an uploaded image with a tapped empty-state suggestion", async () => {
      mockImageAttachment({ status: "ready", uri: image.uri, image })
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))

      expect(environment.mock.getMostRecentOperation().request.variables.input).toMatchObject({
        message: ART_ASSISTANT_SUGGESTIONS[0],
        image: { s3Bucket: "bucket", s3Key: "key" },
      })
      expect(mockRemoveImage).toHaveBeenCalled()
    })

    it("does not send an empty-state suggestion while the image uploads", async () => {
      mockImageAttachment({ status: "uploading", uri: image.uri })
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))

      expect(environment.mock.getAllOperations()).toHaveLength(0)
    })

    it("sends an uploaded image without text and clears it from the composer", async () => {
      mockImageAttachment({ status: "ready", uri: image.uri, image })
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await fireEvent.press(screen.getByLabelText("Send"))

      expect(environment.mock.getMostRecentOperation().request.variables.input).toMatchObject({
        message: "",
        image: { s3Bucket: "bucket", s3Key: "key" },
      })
      expect(screen.getByTestId("art-assistant-attached-image")).toBeOnTheScreen()
      expect(mockRemoveImage).toHaveBeenCalled()
    })

    it("removes the image", async () => {
      mockImageAttachment({ status: "ready", uri: image.uri, image })
      await renderWithWrappers(<ArtAssistant />)

      await fireEvent.press(screen.getByRole("button", { name: "Remove image" }))

      expect(mockRemoveImage).toHaveBeenCalled()
    })
  })

  describe("voice input", () => {
    const { __emit: emitSpeechEvent } = jest.requireMock<{
      __emit: (eventName: string, event?: unknown) => void
    }>("expo-speech-recognition")

    const startDictation = async () => {
      const startCount = jest.mocked(ExpoSpeechRecognitionModule.start).mock.calls.length

      await fireEvent.press(screen.getByRole("button", { name: "Dictate a prompt" }))
      await waitFor(() =>
        expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledTimes(startCount + 1)
      )
      await act(() => emitSpeechEvent("start"))
    }

    const speak = (transcript: string, isFinal = false) =>
      act(() =>
        emitSpeechEvent("result", {
          isFinal,
          results: [{ confidence: 1, segments: [], transcript }],
        })
      )

    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtAssistantVoiceInput: true })
    })

    it("expands the composer as soon as dictation starts, before any text arrives", async () => {
      await renderWithWrappers(<ArtAssistant />)

      expect(screen.queryByLabelText("Send")).not.toBeOnTheScreen()

      await startDictation()

      expect(screen.getByLabelText("Send")).toBeOnTheScreen()
      expect(screen.queryByText("Art Assistant is AI and can make mistakes")).not.toBeOnTheScreen()
    })

    it("hides the microphone while voice input is off", async () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtAssistantVoiceInput: false })
      await renderWithWrappers(<ArtAssistant />)

      expect(screen.queryByRole("button", { name: "Dictate a prompt" })).not.toBeOnTheScreen()
      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")

      expect(screen.getByLabelText("Send")).toBeOnTheScreen()
    })

    it("hides the microphone when the device has no speech recognizer", async () => {
      jest.mocked(ExpoSpeechRecognitionModule.isRecognitionAvailable).mockReturnValueOnce(false)
      await renderWithWrappers(<ArtAssistant />)

      expect(screen.queryByRole("button", { name: "Dictate a prompt" })).not.toBeOnTheScreen()
      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")

      expect(screen.getByLabelText("Send")).toBeOnTheScreen()
    })

    it("shows the microphone inside the composer, next to Send", async () => {
      mockImageAttachment({ status: "uploading", uri: "file:///photo.jpg" })
      await renderWithWrappers(<ArtAssistant />)

      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints")

      expect(
        within(screen.getByTestId("art-assistant-composer-input-container")).getByRole("button", {
          name: "Dictate a prompt",
        })
      ).toBeOnTheScreen()
      expect(screen.getByLabelText("Send")).toBeOnTheScreen()
    })

    it("adds the transcript after text that was already typed", async () => {
      await renderWithWrappers(<ArtAssistant />)

      await fireEvent.changeText(screen.getByLabelText("Art Assistant prompt"), "Warhol prints ")
      await startDictation()
      await speak("under 5000 dollars", true)

      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp(
        "value",
        "Warhol prints under 5000 dollars"
      )
    })

    it("keeps adding to the prompt across several dictations", async () => {
      await renderWithWrappers(<ArtAssistant />)

      await startDictation()
      await speak("moody seascapes", true)
      await act(() => emitSpeechEvent("end"))
      await startDictation()
      await speak("in blue", true)

      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp(
        "value",
        "moody seascapes in blue"
      )
    })

    it("sends what has been dictated so far and stops listening", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await startDictation()
      await speak("moody seascapes")
      await fireEvent.press(screen.getByLabelText("Send"))
      await speak("too late", true)

      expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled()
      expect(environment.mock.getMostRecentOperation().request.variables.input).toMatchObject({
        message: "moody seascapes",
      })
      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    })

    it("writes the transcript into the composer without sending it", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await startDictation()

      expect(KeyboardController.dismiss).toHaveBeenCalled()
      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("editable", false)
      expect(screen.getAllByTestId("art-assistant-voice-input-ring")).toHaveLength(2)
      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp(
        "placeholder",
        "Listening..."
      )

      await speak("moody")
      await speak("moody seascapes", true)

      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "moody seascapes")
      expect(screen.getByRole("button", { name: "Stop dictation" })).toBeOnTheScreen()

      await act(() => emitSpeechEvent("end"))

      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("editable", true)
      expect(screen.queryByTestId("art-assistant-voice-input-ring")).not.toBeOnTheScreen()
      expect(screen.getByLabelText("Send")).toBeEnabled()
      expect(environment.mock.getAllOperations()).toHaveLength(0)
    })

    it("stops listening from the stop button", async () => {
      await renderWithWrappers(<ArtAssistant />)

      await startDictation()
      await fireEvent.press(screen.getByRole("button", { name: "Stop dictation" }))

      expect(ExpoSpeechRecognitionModule.stop).toHaveBeenCalled()
    })

    it("tracks the taps that start and stop dictation", async () => {
      await renderWithWrappers(<ArtAssistant />)

      await startDictation()
      await fireEvent.press(screen.getByRole("button", { name: "Stop dictation" }))

      const voiceInputTaps = mockTrackEvent.mock.calls
        .map(([call]) => call as Record<string, any>)
        .filter((call) => call.action === "tappedArtAssistantVoiceInput")

      expect(voiceInputTaps).toEqual([
        {
          action: "tappedArtAssistantVoiceInput",
          context_module: "artAssistant",
          context_screen_owner_type: "artAssistant",
          conversation_id: expect.any(String),
          type: "start",
        },
        {
          action: "tappedArtAssistantVoiceInput",
          context_module: "artAssistant",
          context_screen_owner_type: "artAssistant",
          conversation_id: voiceInputTaps[0].conversation_id,
          type: "stop",
        },
      ])
    })

    it("stops listening when a suggestion is sent mid-dictation", async () => {
      const environment = createMockEnvironment()
      await renderWithHookWrappersTL(<ArtAssistant />, environment)

      await startDictation()
      await fireEvent.press(screen.getByText(ART_ASSISTANT_SUGGESTIONS[0]))
      await speak("too late", true)

      expect(ExpoSpeechRecognitionModule.abort).toHaveBeenCalled()
      expect(environment.mock.getMostRecentOperation().request.variables.input).toMatchObject({
        message: ART_ASSISTANT_SUGGESTIONS[0],
      })
      expect(screen.getByLabelText("Art Assistant prompt")).toHaveProp("value", "")
    })
  })
})
