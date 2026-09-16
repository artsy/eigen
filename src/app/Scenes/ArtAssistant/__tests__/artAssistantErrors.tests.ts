import { captureException, captureMessage } from "@sentry/react-native"
import {
  ART_ASSISTANT_GENERIC_ERROR,
  reportArtAssistantTurnFailure,
  stopReasonMessage,
  subscriptionErrorMessage,
} from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import { MetaphysicsSubscriptionError } from "app/system/relay/helpers/metaphysicsSubscriptionError"

describe("stopReasonMessage", () => {
  it("explains a known stop reason", () => {
    expect(stopReasonMessage("max_iterations")).toBe("I ran out of steps. Try a narrower request.")
  })

  it("falls back when the server adds a stop reason we do not know", () => {
    expect(stopReasonMessage("context_window_exceeded")).toBe(ART_ASSISTANT_GENERIC_ERROR)
  })
})

describe("subscriptionErrorMessage", () => {
  beforeAll(() => {
    // @ts-ignore
    __DEV__ = false
  })

  afterAll(() => {
    // @ts-ignore
    __DEV__ = true
  })

  it.each([401, 403])("asks the user to sign in again on %s", (status) => {
    const error = new MetaphysicsSubscriptionError("Server responded with a failure", { status })

    expect(subscriptionErrorMessage(error)).toBe("Please sign in again to use Art Assistant.")
  })

  it("explains rate limiting on 429", () => {
    const error = new MetaphysicsSubscriptionError("Server responded with a failure", {
      status: 429,
    })

    expect(subscriptionErrorMessage(error)).toBe(
      "You've reached the request limit. Please try again shortly."
    )
  })

  it("does not show server copy for any other status", () => {
    const error = new MetaphysicsSubscriptionError("Server responded with 500: Bad Gateway", {
      status: 500,
    })

    expect(subscriptionErrorMessage(error)).toBe(ART_ASSISTANT_GENERIC_ERROR)
  })

  it("ignores status-looking text in an untyped error", () => {
    expect(subscriptionErrorMessage(new Error("401 Unauthorized"))).toBe(
      ART_ASSISTANT_GENERIC_ERROR
    )
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
