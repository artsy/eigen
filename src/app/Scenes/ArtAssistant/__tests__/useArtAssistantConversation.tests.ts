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
import { createElement, ReactNode } from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

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

    expect(searching.message.progress).toEqual(["Thinking...", "Searching artworks..."])

    const thinking = reduceActiveTurn(searching, {
      __typename: "AIAgentToolResult",
      ok: true,
    })

    expect(thinking.message.progress).toEqual(["Thinking...", "Searching artworks..."])
  })

  it("falls back to Thinking for a future activity", () => {
    const result = reduceActiveTurn(createActiveTurn(), {
      __typename: "AIAgentToolCall",
      activity: "%future added value",
    })

    expect(result.message.progress).toEqual(["Thinking..."])
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
        progress: [],
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
    progress: ["Thinking..."],
  },
})
