import { act, renderHook } from "@testing-library/react-native"
import { useArtAssistantConversationAgentTurnSubscription$data } from "__generated__/useArtAssistantConversationAgentTurnSubscription.graphql"
import { TestProviders } from "app/Providers"
import {
  ActiveTurn,
  reduceActiveTurn,
  toHistory,
  useArtAssistantConversation,
} from "app/Scenes/ArtAssistant/hooks/useArtAssistantConversation"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/types"
import { ART_ASSISTANT_ERRORS } from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
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
  it("ignores text deltas until the terminal event", () => {
    const responding = createActiveTurn()

    const streaming = reduceActiveTurn(responding, {
      __typename: "AIAgentTextDelta",
      text: "A partial answer",
    })

    expect(streaming).toBe(responding)
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
    const result = reduceActiveTurn(
      createActiveTurn(),
      terminalEvent({
        message: "Here are two works.",
        sections: [
          {
            __typename: "AIAgentArtworksSection",
            artworks: [{ internalID: "first" }, { internalID: "second" }],
          },
        ],
        artworks: [{ internalID: "first" }, { internalID: "second" }],
      })
    )

    expect(result.message).toMatchObject({
      phase: "complete",
      text: "Here are two works.",
      sections: [{ type: "artworks", artworkIDs: ["first", "second"] }],
    })
  })

  it("publishes an artists section", () => {
    const result = reduceActiveTurn(
      createActiveTurn(),
      terminalEvent({
        message: "Two artists you might like.",
        sections: [
          {
            __typename: "AIAgentArtistsSection",
            artists: [{ internalID: "warhol" }, { internalID: "basquiat" }],
          },
        ],
        artworks: [],
      })
    )

    expect(result.message).toMatchObject({
      phase: "complete",
      sections: [{ type: "artists", artistIDs: ["warhol", "basquiat"] }],
    })
  })

  it("ignores a section type this client does not know yet", () => {
    const result = reduceActiveTurn(
      createActiveTurn(),
      terminalEvent({
        message: "Two shows worth a visit.",
        sections: [{ __typename: "%other" }],
        artworks: [],
      })
    )

    expect(result.message).toMatchObject({ phase: "complete", sections: undefined })
  })

  it("falls back to legacy artworks when no section arrived", () => {
    const result = reduceActiveTurn(
      createActiveTurn(),
      terminalEvent({
        message: "Here are two works.",
        sections: [],
        artworks: [{ internalID: "first" }, { internalID: "second" }],
      })
    )

    expect(result.message).toMatchObject({
      sections: [{ type: "artworks", artworkIDs: ["first", "second"] }],
    })
  })

  it("leaves a text-only answer without sections", () => {
    const result = reduceActiveTurn(
      createActiveTurn(),
      terminalEvent({ message: "We can't show that.", sections: [], artworks: [] })
    )

    expect(result.message).toMatchObject({ phase: "complete", sections: undefined })
  })

  it("keeps the answer's suggested replies in order", () => {
    const result = reduceActiveTurn(
      createActiveTurn(),
      terminalEvent({
        message: "Here are two works.",
        sections: [],
        artworks: [],
        suggestedReplies: [{ text: "Show me cheaper ones" }, { text: "Only paintings" }],
      })
    )

    expect(result.message).toMatchObject({
      suggestedReplies: ["Show me cheaper ones", "Only paintings"],
    })
  })

  it("asks for a more specific prompt when the agent finished without an answer, even after text deltas", () => {
    const streaming = reduceActiveTurn(createActiveTurn(), {
      __typename: "AIAgentTextDelta",
      text: "Recovered answer",
    })

    const result = reduceActiveTurn(
      streaming,
      terminalEvent({ message: null, sections: [], artworks: [] })
    )

    expect(result.message).toMatchObject({
      phase: "error",
      error: "unclear",
      text: ART_ASSISTANT_ERRORS.unclear.message,
    })
  })

  it("replays previously shown cards by entity type and display order", () => {
    const messages: ArtAssistantMessage[] = [
      { id: "user", role: "user", text: "show me blue works" },
      {
        id: "assistant-artworks",
        role: "assistant",
        text: "Here are some works.",
        phase: "complete",
        sections: [{ type: "artworks", artworkIDs: ["first", "second"] }],
      },
      { id: "user-artists", role: "user", text: "who else should I look at" },
      {
        id: "assistant-artists",
        role: "assistant",
        text: "These artists, then.",
        phase: "complete",
        sections: [{ type: "artists", artistIDs: ["warhol"] }],
      },
    ]

    expect(toHistory(messages)).toEqual([
      { role: "USER", content: "show me blue works" },
      {
        role: "ASSISTANT",
        content: "Here are some works.",
        displayedSections: [{ entityType: "ARTWORK", internalIDs: ["first", "second"] }],
      },
      { role: "USER", content: "who else should I look at" },
      {
        role: "ASSISTANT",
        content: "These artists, then.",
        displayedSections: [{ entityType: "ARTIST", internalIDs: ["warhol"] }],
      },
    ])
  })

  it("omits displayed sections from a text-only answer", () => {
    expect(
      toHistory([
        {
          id: "assistant",
          role: "assistant",
          text: "That's not something we can show you.",
          phase: "complete",
        },
      ])
    ).toEqual([
      {
        role: "ASSISTANT",
        content: "That's not something we can show you.",
        displayedSections: undefined,
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
      emit(
        environment,
        operation,
        terminalEvent({ message: "Final answer", sections: [], artworks: [] })
      )
    })

    expect(result.current.messages).not.toBe(messagesAfterSubmit)
    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "complete",
      text: "Final answer",
    })
  })

  it("declares the section types this build can render", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    // Metaphysics defaults an omitted list to [ARTWORKS], so sending it is what opts this build
    // into artist sections at all — and what keeps prose from promising cards we can't render.
    expect(environment.mock.getMostRecentOperation().request.variables.input).toMatchObject({
      supportedSections: ["ARTWORKS", "ARTISTS"],
    })
  })

  it("ends the turn on the terminal event instead of waiting for the stream to close", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    expect(result.current.isResponding).toBe(true)

    const operation = environment.mock.getMostRecentOperation()

    act(() => {
      emit(
        environment,
        operation,
        terminalEvent({ message: "I found a few works for you.", sections: [], artworks: [] })
      )
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

type NormalizedEvent = NonNullable<
  useArtAssistantConversationAgentTurnSubscription$data["aiAgentTurn"]
>
type TerminalEvent = Extract<NormalizedEvent, { __typename: "AIAgentTurnComplete" }>

const terminalEvent = (
  event: Pick<TerminalEvent, "message" | "sections" | "artworks"> &
    Partial<Pick<TerminalEvent, "suggestedReplies">>
): TerminalEvent => ({
  __typename: "AIAgentTurnComplete",
  stopReason: "end_turn",
  toolCallCount: 1,
  suggestedReplies: [],
  ...event,
})

const createActiveTurn = (): ActiveTurn => ({
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
      emit(environment, operation, { __typename: "AIAgentTextDelta", text: "An unfinished answer" })
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
    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "error",
      error: "timeout",
      text: ART_ASSISTANT_ERRORS.timeout.message,
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
    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "error",
      error: "generic",
      text: ART_ASSISTANT_ERRORS.generic.message,
    })
  })

  it("uses the generic error when the stream ends without an answer", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    act(() => environment.mock.complete(environment.mock.getMostRecentOperation()))

    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "error",
      error: "generic",
      text: ART_ASSISTANT_ERRORS.generic.message,
    })
  })

  it("reports a message sent without a valid session", () => {
    __globalStoreTestUtils__?.injectState({ auth: { userID: null, userAccessToken: null } })

    const { result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const [sent, failed] = trackedEvents(["sentArtAssistantMessage", "artAssistantTurnFailed"])

    expect(failed).toMatchObject({ outcome: "unauthenticated" })
    expect(failed.prompt_message_id).toEqual(sent.message_id)
    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "error",
      error: "generic",
      text: ART_ASSISTANT_ERRORS.generic.message,
    })
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

  it("reports a tapped suggested reply without its text while the content experiment is off", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    const conversationID =
      environment.mock.getMostRecentOperation().request.variables.input.conversationID

    act(() => result.current.trackSuggestedReplyTapped("Only paintings", 1, "assistant-1"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtAssistantSuggestedReply",
      context_module: "artAssistantSuggestedReplies",
      context_screen_owner_type: "artAssistant",
      conversation_id: conversationID,
      position: 1,
      response_message_id: "assistant-1",
    })
  })

  it("reports the tapped suggested reply text while the content experiment is on", () => {
    jest
      .mocked(useExperimentFlag)
      .mockImplementation((name) => name === "onyx_send-art-assistant-messages-to-segment")

    const { result } = renderConversation()

    act(() => result.current.trackSuggestedReplyTapped("Only paintings", 1, "assistant-1"))

    const [tapped] = trackedEvents(["tappedArtAssistantSuggestedReply"])

    expect(tapped.reply).toBe("Only paintings")
  })

  it("tells the collector to come back later when they ran out of turns", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    act(() =>
      emit(environment, environment.mock.getMostRecentOperation(), {
        __typename: "AIAgentTurnComplete",
        message: null,
        stopReason: "rate_limited",
        toolCallCount: 0,
        artworks: null,
      })
    )

    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "error",
      error: "rate_limited",
      text: ART_ASSISTANT_ERRORS.rate_limited.message,
    })
  })

  it("offers a new chat when Metaphysics rejects the conversation as too large", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))

    act(() =>
      environment.mock.rejectMostRecentOperation(
        new MetaphysicsSubscriptionError("Conversation input is too large (max 100000 bytes)", {
          status: 200,
          graphQLErrors: ["Conversation input is too large (max 100000 bytes)"],
        })
      )
    )

    expect(result.current.messages.at(-1)).toMatchObject({
      phase: "error",
      error: "conversation_limit",
    })
  })

  it("does not send a turn once the history is longer than Metaphysics accepts", () => {
    const { environment, result } = renderConversation()

    // 20 answered turns are 40 history messages, the most Metaphysics accepts.
    for (let turn = 0; turn <= 20; turn++) {
      act(() => result.current.submit(`prompt ${turn}`))
      act(() =>
        emit(environment, environment.mock.getMostRecentOperation(), {
          __typename: "AIAgentTurnComplete",
          message: `answer ${turn}`,
          stopReason: "end_turn",
          toolCallCount: 0,
          artworks: [],
        })
      )
    }

    const operationCount = environment.mock.getAllOperations().length
    jest.mocked(mockTrackEvent).mockClear()

    act(() => result.current.submit("one more"))

    expect(environment.mock.getAllOperations()).toHaveLength(operationCount)
    expect(trackedEventsOfType("sentArtAssistantMessage")).toHaveLength(0)
    expect(result.current.isResponding).toBe(false)
    expect(result.current.messages.slice(-2)).toMatchObject([
      { role: "user", text: "one more" },
      { role: "assistant", phase: "error", error: "conversation_limit" },
    ])
  })

  it("asks the failed prompt again in place of the failed exchange", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))
    act(() => environment.mock.complete(environment.mock.getMostRecentOperation()))

    act(() => result.current.retry())

    const { input } = environment.mock.getMostRecentOperation().request.variables

    expect(input.message).toBe("blue painting")
    expect(input.history).toEqual([])
    expect(result.current.messages).toMatchObject([
      { role: "user", text: "blue painting" },
      { role: "assistant", phase: "responding" },
    ])
  })

  it("does not retry an answer that did not fail", () => {
    const { environment, result } = renderConversation()

    act(() => result.current.submit("blue painting"))
    act(() =>
      emit(environment, environment.mock.getMostRecentOperation(), {
        __typename: "AIAgentTurnComplete",
        message: "I found two works for you.",
        stopReason: "end_turn",
        toolCallCount: 1,
        artworks: [],
      })
    )

    const operationCount = environment.mock.getAllOperations().length

    act(() => result.current.retry())

    expect(environment.mock.getAllOperations()).toHaveLength(operationCount)
    expect(result.current.messages).toHaveLength(2)
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
