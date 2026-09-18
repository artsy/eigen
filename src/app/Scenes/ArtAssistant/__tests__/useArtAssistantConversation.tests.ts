import { act, renderHook } from "@testing-library/react-native"
import { ArtAssistantAgentTurnSubscription$data } from "__generated__/ArtAssistantAgentTurnSubscription.graphql"
import { TestProviders } from "app/Providers"
import {
  ActiveTurn,
  reduceActiveTurn,
  toHistory,
  useArtAssistantConversation,
} from "app/Scenes/ArtAssistant/hooks/useArtAssistantConversation"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/types"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { MetaphysicsSubscriptionError } from "app/system/relay/helpers/metaphysicsSubscriptionError"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { createElement, ReactNode } from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

describe("Art Assistant conversation reducer", () => {
  it("keeps text deltas private until the terminal event", () => {
    const responding = createActiveTurn()

    const streaming = reduceActiveTurn(responding, {
      __typename: "AIAgentTextDelta",
      text: "A partial answer",
    })

    expect(streaming.streamedText).toBe("A partial answer")
    expect(streaming.message.text).toBe("")
    expect(streaming.message.phase).toBe("responding")
  })

  it("keeps the latest activity visible while the agent is working", () => {
    const searching = reduceActiveTurn(createActiveTurn(), {
      __typename: "AIAgentToolCall",
      activity: "SEARCHING_ARTWORKS",
    })

    expect(searching.message.activity).toBe("Searching artworks...")

    const thinking = reduceActiveTurn(searching, {
      __typename: "AIAgentToolResult",
      ok: true,
    })

    expect(thinking.message.activity).toBe("Searching artworks...")
  })

  it("falls back to Thinking for a future activity", () => {
    const result = reduceActiveTurn(createActiveTurn(), {
      __typename: "AIAgentToolCall",
      activity: "%future added value",
    })

    expect(result.message.activity).toBe("Thinking...")
  })

  it("publishes the final answer and preserves artwork ranking", () => {
    const event = {
      __typename: "AIAgentTurnComplete" as const,
      message: "Here are two works.",
      stopReason: "end_turn",
      toolCallCount: 1,
      artworks: [{ internalID: "first" }, { internalID: "second" }],
    } as Extract<NormalizedEvent, { __typename: "AIAgentTurnComplete" }>

    const result = reduceActiveTurn(createActiveTurn(), event)

    expect(result.message).toMatchObject({
      phase: "complete",
      text: "Here are two works.",
      artworkRail: { status: "ready", artworkIDs: ["first", "second"] },
    })
  })

  it("uses accumulated deltas when the terminal message is null", () => {
    const streaming = reduceActiveTurn(createActiveTurn(), {
      __typename: "AIAgentTextDelta",
      text: "Recovered answer",
    })

    const result = reduceActiveTurn(streaming, {
      __typename: "AIAgentTurnComplete",
      message: null,
      stopReason: "end_turn",
      toolCallCount: 0,
      artworks: [],
    })

    expect(result.message).toMatchObject({ phase: "complete", text: "Recovered answer" })
  })

  it("includes previously shown artwork IDs in follow-up history", () => {
    const messages: ArtAssistantMessage[] = [
      { id: "user", role: "user", text: "show me blue works" },
      {
        id: "assistant",
        role: "assistant",
        text: "Here are some works.",
        phase: "complete",
        artworkRail: { status: "ready", artworkIDs: ["first", "second"] },
      },
    ]

    expect(toHistory(messages)).toEqual([
      { role: "USER", content: "show me blue works" },
      {
        role: "ASSISTANT",
        content: "Here are some works.",
        artworkIDs: ["first", "second"],
      },
    ])
  })
})

describe("useArtAssistantConversation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.injectState({
      auth: { userID: "user-id", userAccessToken: "access-token" },
    })
  })

  it("does not touch the message list while only text deltas arrive", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const operation = environment.mock.getMostRecentOperation()
    const messagesAfterSubmit = result.current.messages

    act(() => {
      emit(environment, operation, { __typename: "AIAgentTextDelta", text: "A partial " })
      emit(environment, operation, { __typename: "AIAgentTextDelta", text: "answer" })
    })

    expect(result.current.messages).toBe(messagesAfterSubmit)

    act(() => {
      emit(environment, operation, {
        __typename: "AIAgentTurnComplete",
        message: null,
        stopReason: "end_turn",
        toolCallCount: 0,
        artworks: [],
      })
    })

    expect(result.current.messages).not.toBe(messagesAfterSubmit)
    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "complete",
      text: "A partial answer",
    })
  })

  it("ends the turn on the terminal event instead of waiting for the stream to close", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    expect(result.current.isResponding).toBe(true)

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      emit(environment, operation, {
        __typename: "AIAgentTurnComplete",
        message: "I found a few works for you.",
        stopReason: "end_turn",
        toolCallCount: 1,
        artworks: [],
      })
    })

    // No `environment.mock.complete(operation)`: the stream is still open.
    expect(result.current.isResponding).toBe(false)
  })
})

const renderConversation = () => {
  const environment = createMockEnvironment()
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      TestProviders,
      { skipRelay: true },
      createElement(RelayEnvironmentProvider, { environment, children })
    )

  const { result } = renderHook(() => useArtAssistantConversation(), { wrapper })

  return { environment, result }
}

const emit = (
  environment: ReturnType<typeof createMockEnvironment>,
  operation: Parameters<typeof environment.mock.nextValue>[0],
  aiAgentTurn: object
) => environment.mock.nextValue(operation, { data: { aiAgentTurn } })

type NormalizedEvent = NonNullable<ArtAssistantAgentTurnSubscription$data["aiAgentTurn"]>

const createActiveTurn = (): ActiveTurn => ({
  streamedText: "",
  didReceiveTerminalEvent: false,
  message: {
    id: "assistant",
    role: "assistant",
    text: "",
    phase: "responding",
    activity: "Thinking...",
  },
})

describe("useArtAssistantConversation tracking", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useExperimentFlag).mockReturnValue(false)
    __globalStoreTestUtils__?.injectState({
      auth: { userID: "user-id", userAccessToken: "access-token" },
    })
  })

  it("reports the sent message and the answer it received", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting", { type: "suggestion" }))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "sentArtAssistantMessage",
        character_count: 13,
        context_module: "artAssistant",
        context_screen_owner_type: "artAssistant",
        message_index: 0,
        type: "suggestion",
      })
    )

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      emit(environment, operation, { __typename: "AIAgentTextDelta", text: "A partial answer" })
      emit(environment, operation, {
        __typename: "AIAgentTurnComplete",
        message: "I found two works for you.",
        stopReason: "end_turn",
        toolCallCount: 3,
        artworks: [{ internalID: "first" }, { internalID: "second" }],
      })
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "receivedArtAssistantResponse",
        context_module: "artAssistant",
        context_screen_owner_type: "artAssistant",
        item_count: 2,
        item_ids: ["first", "second"],
        item_type: "artwork",
        stop_reason: "end_turn",
        tool_call_count: 3,
      })
    )

    const [sent, received] = trackedEvents([
      "sentArtAssistantMessage",
      "receivedArtAssistantResponse",
    ])

    expect(received.prompt_message_id).toEqual(sent.message_id)
    expect(sent.conversation_id).toEqual(received.conversation_id)
    expect(received.duration_ms).toEqual(expect.any(Number))
  })

  it("keeps the message and the answer out of Segment while the content experiment is off", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      emit(environment, operation, {
        __typename: "AIAgentTurnComplete",
        message: "I found two works for you.",
        stopReason: "end_turn",
        toolCallCount: 1,
        artworks: [],
      })
    })

    const [sent, received] = trackedEvents([
      "sentArtAssistantMessage",
      "receivedArtAssistantResponse",
    ])

    expect(sent).not.toHaveProperty("message")
    expect(received).not.toHaveProperty("response")
    // The metrics that do not depend on the flag still arrive.
    expect(sent.character_count).toBe(13)
    expect(received.item_count).toBe(0)
  })

  it("sends the message and the answer while the content experiment is on", () => {
    jest
      .mocked(useExperimentFlag)
      .mockImplementation((name) => name === "onyx_send-art-assistant-messages-to-segment")

    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      emit(environment, operation, {
        __typename: "AIAgentTurnComplete",
        message: "I found two works for you.",
        stopReason: "end_turn",
        toolCallCount: 1,
        artworks: [],
      })
    })

    const [sent, received] = trackedEvents([
      "sentArtAssistantMessage",
      "receivedArtAssistantResponse",
    ])

    expect(sent.message).toBe("blue painting")
    expect(received.response).toBe("I found two works for you.")
  })

  it("reports a turn the agent stopped without an answer instead of a response", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      emit(environment, operation, {
        __typename: "AIAgentTurnComplete",
        message: null,
        stopReason: "max_iterations",
        toolCallCount: 8,
        artworks: [],
      })
    })

    const [failed] = trackedEvents(["artAssistantTurnFailed"])

    expect(failed).toMatchObject({
      action: "artAssistantTurnFailed",
      context_module: "artAssistant",
      context_screen_owner_type: "artAssistant",
      outcome: "stopped_without_answer",
      stop_reason: "max_iterations",
    })
    expect(trackedEventsOfType("receivedArtAssistantResponse")).toHaveLength(0)
  })

  it("reports a broken stream", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    act(() =>
      environment.mock.rejectMostRecentOperation(
        new MetaphysicsSubscriptionError("Too many requests", { status: 429 })
      )
    )

    const [failed] = trackedEvents(["artAssistantTurnFailed"])

    expect(failed).toMatchObject({
      action: "artAssistantTurnFailed",
      error_status: 429,
      outcome: "stream_error",
    })
  })

  it("reports a message sent without a valid session", () => {
    __globalStoreTestUtils__?.injectState({ auth: { userID: null, userAccessToken: null } })

    const { result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const [sent, failed] = trackedEvents(["sentArtAssistantMessage", "artAssistantTurnFailed"])

    expect(failed).toMatchObject({ outcome: "unauthenticated" })
    expect(failed.prompt_message_id).toEqual(sent.message_id)
  })

  it("reports the conversation that was discarded for a new chat", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const conversationID =
      environment.mock.getMostRecentOperation().request.variables.input.conversationID

    act(() => result.current.startNewConversation())

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtAssistantNewChat",
      context_module: "artAssistant",
      context_screen_owner_type: "artAssistant",
      conversation_id: conversationID,
      message_count: 2,
    })
  })

  it("does not report a new chat when there is nothing to discard", () => {
    const { result } = renderConversation()

    act(() => result.current.startNewConversation())

    expect(trackedEventsOfType("tappedArtAssistantNewChat")).toHaveLength(0)
  })
})

const trackedEventsOfType = (action: string) =>
  mockTrackEvent.mock.calls
    .map(([event]) => event as Record<string, any>)
    .filter((event) => event.action === action)

const trackedEvents = (actions: string[]) =>
  actions.map((action) => {
    const [event] = trackedEventsOfType(action)

    expect(event).toBeDefined()

    return event
  })
