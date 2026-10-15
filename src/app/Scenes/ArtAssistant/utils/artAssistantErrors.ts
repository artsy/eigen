import { captureException, captureMessage } from "@sentry/react-native"
import {
  MetaphysicsSubscriptionError,
  metaphysicsSubscriptionErrorStatus,
} from "app/system/relay/helpers/metaphysicsSubscriptionError"

/**
 * Why a turn ended without an answer, as far as it changes what we tell the collector and what
 * they can do next:
 * - `unclear`: the agent finished normally but had nothing to say, usually a vague prompt
 * - `timeout`: the agent ran out of steps or time, which asking again often fixes
 * - `conversation_limit`: the history is longer than Metaphysics accepts, only a new chat helps
 * - `rate_limited`: the collector used up their quota, nothing helps until it resets
 * - `generic`: a backend or transport failure that may or may not be transient
 */
export type ArtAssistantErrorKind =
  | "unclear"
  | "timeout"
  | "conversation_limit"
  | "rate_limited"
  | "generic"

export type ArtAssistantErrorAction = "retry" | "dismiss" | "newChat" | "close"

interface ArtAssistantErrorCopy {
  message: string
  actions: { action: ArtAssistantErrorAction; label: string }[]
}

export const ART_ASSISTANT_ERRORS: Record<ArtAssistantErrorKind, ArtAssistantErrorCopy> = {
  unclear: {
    message:
      "Sorry, we're still learning and improving. Would you mind trying a phrase that's a bit more specific?",
    actions: [],
  },
  timeout: {
    message:
      "This answer was slightly difficult for us to figure out. Would you mind asking us once more?",
    actions: [
      { action: "retry", label: "Try the same ask again" },
      { action: "dismiss", label: "Forget it, I'll ask something else" },
    ],
  },
  conversation_limit: {
    message: "This is as far as this chat session can go. Want to start a new chat with me?",
    actions: [
      { action: "newChat", label: "Yes! Open a new chat window" },
      { action: "close", label: "No, I'm done for now" },
    ],
  },
  rate_limited: {
    message:
      "Unfortunately, this is as far as our chats can go for now. Please come back and chat with me a little later. Thank you for using Artsy's Art Assistant!",
    actions: [],
  },
  generic: {
    message:
      "Sorry, we're still improving our experience and can't help you further. Would you like to:",
    actions: [
      { action: "retry", label: "Try again" },
      { action: "newChat", label: "Start a new chat instead" },
    ],
  },
}

/**
 * Mirrors Metaphysics' guardrail on `aiAgentTurn` (`MAX_HISTORY_MESSAGES`), which rejects a longer
 * history before streaming. Checking it here lets us tell the collector the chat is full without
 * a round-trip.
 */
export const ART_ASSISTANT_MAX_HISTORY_MESSAGES = 40

/**
 * Metaphysics reports a turn that ended without an answer as a terminal event with a null
 * message; `stopReason` is the only thing that tells the causes apart. Unknown values are model
 * finish reasons (`stop`, `length`, ...), meaning the agent ran but produced nothing usable.
 */
export const artAssistantErrorKindForStopReason = (stopReason: string): ArtAssistantErrorKind => {
  switch (stopReason) {
    case "rate_limited":
      return "rate_limited"
    case "max_iterations":
    case "aborted":
      return "timeout"
    case "error":
      return "generic"
    default:
      return "unclear"
  }
}

// Matched on the message because Metaphysics rejects these with a plain `Error`. The size limit
// can't be checked up front as cheaply as the message count, so this is how we catch it.
const CONVERSATION_LIMIT_REJECTION = /^Conversation (history is too long|input is too large)/

export const artAssistantErrorKindForStreamError = (error: unknown): ArtAssistantErrorKind =>
  error instanceof MetaphysicsSubscriptionError &&
  error.graphQLErrors?.some((message) => CONVERSATION_LIMIT_REJECTION.test(message))
    ? "conversation_limit"
    : "generic"

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
