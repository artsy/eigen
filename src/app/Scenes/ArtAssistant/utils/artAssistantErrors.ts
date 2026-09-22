import { captureException, captureMessage } from "@sentry/react-native"
import { metaphysicsSubscriptionErrorStatus } from "app/system/relay/helpers/metaphysicsSubscriptionError"

export const ART_ASSISTANT_GENERIC_ERROR = "Something went wrong. Please try again later."

export type ArtAssistantTurnOutcome =
  | "stream_error"
  | "trailing_stream_error"
  | "idle_timeout"
  | "ended_without_answer"
  | "stopped_without_answer"

export interface ArtAssistantTurnFailure {
  conversationID: string
  outcome: ArtAssistantTurnOutcome
  error?: unknown
  stopReason?: string
}

/**
 * Subscriptions run outside the Relay middleware chain, so no other layer reports their
 * failures. Prompts are not attached: they are user content and the tags are enough to tell
 * transport failures, server-side stops and stalled streams apart.
 */
export const reportArtAssistantTurnFailure = ({
  conversationID,
  outcome,
  error,
  stopReason,
}: ArtAssistantTurnFailure) => {
  const status = metaphysicsSubscriptionErrorStatus(error)
  const context = {
    level: error ? ("error" as const) : ("warning" as const),
    tags: {
      artAssistantOutcome: outcome,
      ...(stopReason ? { artAssistantStopReason: stopReason } : {}),
      ...(status ? { artAssistantStatus: String(status) } : {}),
    },
    extra: { conversationID },
  }

  if (error) {
    captureException(error, context)
    return
  }

  captureMessage(`Art Assistant turn: ${outcome}`, context)
}
