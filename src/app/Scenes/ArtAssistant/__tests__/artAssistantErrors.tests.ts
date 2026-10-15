import { captureException, captureMessage } from "@sentry/react-native"
import {
  artAssistantErrorKindForStopReason,
  artAssistantErrorKindForStreamError,
  reportArtAssistantTurnFailure,
} from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import { MetaphysicsSubscriptionError } from "app/system/relay/helpers/metaphysicsSubscriptionError"

describe("artAssistantErrorKindForStopReason", () => {
  it.each([
    ["rate_limited", "rate_limited"],
    ["max_iterations", "timeout"],
    ["aborted", "timeout"],
    ["error", "generic"],
    ["stop", "unclear"],
    ["end_turn", "unclear"],
  ])("maps %s to %s", (stopReason, kind) => {
    expect(artAssistantErrorKindForStopReason(stopReason)).toBe(kind)
  })
})

describe("artAssistantErrorKindForStreamError", () => {
  it("recognizes Metaphysics' conversation guardrails", () => {
    const error = new MetaphysicsSubscriptionError("rejected", {
      graphQLErrors: ["Conversation history is too long (max 40 messages)"],
    })

    expect(artAssistantErrorKindForStreamError(error)).toBe("conversation_limit")
  })

  it("treats any other failure as generic", () => {
    expect(
      artAssistantErrorKindForStreamError(
        new MetaphysicsSubscriptionError("Too many requests", { status: 429 })
      )
    ).toBe("generic")
    expect(artAssistantErrorKindForStreamError(new Error("boom"))).toBe("generic")
  })
})

describe("reportArtAssistantTurnFailure", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("captures a transport failure with its status", () => {
    const error = new MetaphysicsSubscriptionError("Server responded with 429: Too Many Requests", {
      status: 429,
    })

    reportArtAssistantTurnFailure({
      conversationID: "conversation-id",
      outcome: "stream_error",
      error,
    })

    expect(captureException).toHaveBeenCalledWith(error, {
      level: "error",
      tags: { artAssistantOutcome: "stream_error", artAssistantStatus: "429" },
      extra: { conversationID: "conversation-id" },
    })
  })

  it("captures a server-side stop as a warning", () => {
    reportArtAssistantTurnFailure({
      conversationID: "conversation-id",
      outcome: "stopped_without_answer",
      stopReason: "max_iterations",
    })

    expect(captureMessage).toHaveBeenCalledWith("Art Assistant turn: stopped_without_answer", {
      level: "warning",
      tags: {
        artAssistantOutcome: "stopped_without_answer",
        artAssistantStopReason: "max_iterations",
      },
      extra: { conversationID: "conversation-id" },
    })
    expect(captureException).not.toHaveBeenCalled()
  })

  it("captures a stalled stream without an error object", () => {
    reportArtAssistantTurnFailure({
      conversationID: "conversation-id",
      outcome: "idle_timeout",
    })

    expect(captureMessage).toHaveBeenCalledWith("Art Assistant turn: idle_timeout", {
      level: "warning",
      tags: { artAssistantOutcome: "idle_timeout" },
      extra: { conversationID: "conversation-id" },
    })
  })
})
