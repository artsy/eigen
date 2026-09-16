import { captureException, captureMessage } from "@sentry/react-native"
import { metaphysicsSubscriptionErrorStatus } from "app/system/relay/helpers/metaphysicsSubscriptionError"

export const ART_ASSISTANT_GENERIC_ERROR = "Something went wrong. Please try again."

const STOP_REASON_MESSAGES: Record<string, string> = {
  aborted: "That took too long, so I stopped. Try narrowing your request.",
  error: ART_ASSISTANT_GENERIC_ERROR,
  max_iterations: "I ran out of steps. Try a narrower request.",
}

/** Copy for a turn the agent ended without an answer. */
export const stopReasonMessage = (stopReason: string) =>
  STOP_REASON_MESSAGES[stopReason] ?? ART_ASSISTANT_GENERIC_ERROR

/** Copy for a turn that failed in transit. */
export const subscriptionErrorMessage = (error: unknown) => {
  if (__DEV__ && error instanceof Error) {
    return error.message
  }

  switch (metaphysicsSubscriptionErrorStatus(error)) {
    case 401:
    case 403:
      return "Please sign in again to use Art Assistant."
    case 429:
      return "You've reached the request limit. Please try again shortly."
    default:
      return ART_ASSISTANT_GENERIC_ERROR
  }
}

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
