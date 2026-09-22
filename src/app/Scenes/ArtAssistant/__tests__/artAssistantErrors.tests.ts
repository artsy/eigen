import { captureException, captureMessage } from "@sentry/react-native"
import { reportArtAssistantTurnFailure } from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import { MetaphysicsSubscriptionError } from "app/system/relay/helpers/metaphysicsSubscriptionError"

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
