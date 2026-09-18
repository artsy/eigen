import { ArtAssistantTurnFailed, OwnerType, SentArtAssistantMessage } from "@artsy/cohesion"
import {
  AIAgentActivity,
  ArtAssistantAgentTurnSubscription,
  ArtAssistantAgentTurnSubscription$data,
  ArtAssistantAgentTurnSubscription$variables,
} from "__generated__/ArtAssistantAgentTurnSubscription.graphql"
import { useArtAssistantTracking } from "app/Scenes/ArtAssistant/hooks/useArtAssistantTracking"
import { artAssistantAgentTurnSubscription } from "app/Scenes/ArtAssistant/transport/ArtAssistantAgentTurnSubscription"
import { ArtAssistantMessage } from "app/Scenes/ArtAssistant/types"
import {
  ArtAssistantTurnFailure,
  reportArtAssistantTurnFailure,
  stopReasonMessage,
  subscriptionErrorMessage,
} from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import {
  ArtAssistantHistoryEntry,
  trimArtAssistantHistory,
} from "app/Scenes/ArtAssistant/utils/conversationHistory"
import { GlobalStore } from "app/store/GlobalStore"
import { metaphysicsSubscriptionErrorStatus } from "app/system/relay/helpers/metaphysicsSubscriptionError"
import { useCallback, useEffect, useRef, useState } from "react"
import { requestSubscription, useRelayEnvironment } from "react-relay"
import { v4 as uuid } from "uuid"

type AssistantMessage = Extract<ArtAssistantMessage, { role: "assistant" }>
type NormalizedAgentEvent = NonNullable<ArtAssistantAgentTurnSubscription$data["aiAgentTurn"]>

export interface ActiveTurn {
  message: AssistantMessage
  streamedText: string
  didReceiveTerminalEvent: boolean
}

const ACTIVITY_COPY: Record<Exclude<AIAgentActivity, "%future added value">, string> = {
  THINKING: "Thinking...",
  SEARCHING_ARTWORKS: "Searching artworks...",
  SEARCHING_ARTISTS: "Searching artists...",
  SEARCHING_SHOWS: "Searching shows...",
  SEARCHING_FAIRS: "Searching fairs...",
  FINDING_RECOMMENDATIONS: "Finding recommendations...",
  LOADING_ARTWORK_DETAILS: "Loading artwork details...",
  SEARCHING_ARTSY: "Searching Artsy...",
}

export const ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS = 60_000

export const useArtAssistantConversation = () => {
  const environment = useRelayEnvironment()
  const { trackMessageSent, trackNewChat, trackResponseReceived, trackTurnFailed } =
    useArtAssistantTracking()
  const userID = GlobalStore.useAppState((state) => state.auth.userID)
  const authenticationToken = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const [messages, setMessages] = useState<ArtAssistantMessage[]>([])
  const [isResponding, setIsResponding] = useState(false)
  const isRespondingRef = useRef(false)
  const conversationID = useRef(uuid())
  const activeSubscription = useRef<ReturnType<typeof requestSubscription> | null>(null)
  const responseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesRef = useRef(messages)

  messagesRef.current = messages

  const abort = useCallback(() => {
    activeSubscription.current?.dispose()
    activeSubscription.current = null

    if (responseTimeout.current) {
      clearTimeout(responseTimeout.current)
      responseTimeout.current = null
    }
  }, [])

  useEffect(() => abort, [abort])

  const startNewConversation = useCallback(() => {
    const discardedMessages = messagesRef.current

    if (discardedMessages.length > 0) {
      trackNewChat(conversationID.current, discardedMessages.length)
    }

    abort()
    conversationID.current = uuid()
    messagesRef.current = []
    isRespondingRef.current = false
    setMessages([])
    setIsResponding(false)
  }, [abort, trackNewChat])

  const submit = useCallback(
    (prompt: string, options?: { type: SentArtAssistantMessage["type"] }) => {
      const text = prompt.trim()

      if (!text || isRespondingRef.current) {
        return
      }

      const startedAt = Date.now()
      const previousMessages = messagesRef.current
      const userMessage: ArtAssistantMessage = { id: uuid(), role: "user", text }
      const assistantMessage: AssistantMessage = {
        id: uuid(),
        role: "assistant",
        text: "",
        phase: "responding",
        activity: ACTIVITY_COPY.THINKING,
      }
      let activeTurn: ActiveTurn = {
        message: assistantMessage,
        streamedText: "",
        didReceiveTerminalEvent: false,
      }
      const trackFailure = (
        outcome: ArtAssistantTurnFailed["outcome"],
        failure: { error?: unknown; stopReason?: string } = {}
      ) =>
        trackTurnFailed({
          conversationID: conversationID.current,
          durationMs: Date.now() - startedAt,
          errorStatus: metaphysicsSubscriptionErrorStatus(failure.error),
          messageID: assistantMessage.id,
          outcome,
          promptMessageID: userMessage.id,
          stopReason: failure.stopReason,
        })

      isRespondingRef.current = true
      setIsResponding(true)
      setMessages([...previousMessages, userMessage, assistantMessage])

      trackMessageSent({
        conversationID: conversationID.current,
        message: text,
        messageID: userMessage.id,
        messageIndex: previousMessages.filter((message) => message.role === "user").length,
        type: options?.type ?? "typed",
      })

      const updateAssistant = (nextTurn: ActiveTurn) => {
        const previousMessage = activeTurn.message

        activeTurn = nextTurn

        // A text delta only grows `streamedText`; the rendered message is the same object, so
        // skip the state update instead of re-rendering the whole list on every token.
        if (nextTurn.message === previousMessage) {
          return
        }

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id ? activeTurn.message : message
          )
        )
      }

      if (!userID || !authenticationToken) {
        updateAssistant(failActiveTurn(activeTurn, "Please sign in again to use Art Assistant."))
        trackFailure("unauthenticated")
        isRespondingRef.current = false
        setIsResponding(false)
        return
      }

      const input = {
        conversationID: conversationID.current,
        message: text,
        history: trimArtAssistantHistory(toHistory(previousMessages), text),
      }
      const variables: ArtAssistantAgentTurnSubscription$variables = { input }

      abort()

      let didFinish = false
      let subscription: ReturnType<typeof requestSubscription> | null = null
      let timeout: ReturnType<typeof setTimeout> | null = null

      const finish = () => {
        if (didFinish) {
          return
        }

        didFinish = true

        if (activeSubscription.current === subscription) {
          activeSubscription.current = null
        }

        if (timeout) {
          clearTimeout(timeout)
        }

        if (responseTimeout.current === timeout) {
          responseTimeout.current = null
        }

        setIsResponding(false)
        isRespondingRef.current = false
      }

      const reportFailure = (failure: Omit<ArtAssistantTurnFailure, "conversationID">) => {
        reportArtAssistantTurnFailure({ ...failure, conversationID: input.conversationID })
        trackFailure(failure.outcome, failure)
      }

      const finishTurn = () => {
        // `subscription` is still null when the payload arrived synchronously; the caller
        // disposes in that case, guided by `didFinish`.
        subscription?.dispose()
        finish()
      }

      const failIdleTurn = () => {
        subscription?.dispose()

        if (activeTurn.didReceiveTerminalEvent) {
          finish()
          return
        }

        reportFailure({ outcome: "idle_timeout" })
        updateAssistant(
          failActiveTurn(activeTurn, "This is taking longer than expected. Please try again.")
        )
        finish()
      }

      // A turn can legitimately run for minutes while the agent calls tools, so the deadline
      // measures silence rather than total duration: any event proves the stream is alive.
      const restartIdleTimeout = () => {
        if (didFinish) {
          return
        }

        if (timeout) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(failIdleTurn, ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS)
        responseTimeout.current = timeout
      }

      subscription = requestSubscription<ArtAssistantAgentTurnSubscription>(environment, {
        subscription: artAssistantAgentTurnSubscription,
        variables,
        onNext: (data) => {
          const event = data?.aiAgentTurn

          restartIdleTimeout()

          if (event) {
            const nextTurn = reduceActiveTurn(activeTurn, event)
            updateAssistant(nextTurn)

            if (event.__typename === "AIAgentTurnComplete") {
              if (nextTurn.message.phase === "error") {
                reportFailure({ outcome: "stopped_without_answer", stopReason: event.stopReason })
              } else {
                const artworks = event.artworks ?? []

                trackResponseReceived({
                  conversationID: input.conversationID,
                  durationMs: Date.now() - startedAt,
                  itemIDs: artworks.map((artwork) => artwork.internalID),
                  itemType: artworks.length > 0 ? OwnerType.artwork : undefined,
                  messageID: assistantMessage.id,
                  promptMessageID: userMessage.id,
                  response: nextTurn.message.text,
                  stopReason: event.stopReason,
                  toolCallCount: event.toolCallCount,
                })
              }

              // Metaphysics keeps the stream open after the answer is final, so end the turn on
              // the application-level terminal event instead of waiting for the protocol one.
              finishTurn()
            }
          }
        },
        onError: (error) => {
          if (activeTurn.didReceiveTerminalEvent) {
            // The answer is already on screen, so keep it and only report the broken stream.
            reportFailure({ outcome: "trailing_stream_error", error })
            finish()
            return
          }

          reportFailure({ outcome: "stream_error", error })
          updateAssistant(failActiveTurn(activeTurn, subscriptionErrorMessage(error)))
          finish()
        },
        onCompleted: () => {
          if (!activeTurn.didReceiveTerminalEvent && activeTurn.message.phase === "responding") {
            reportFailure({ outcome: "ended_without_answer" })
            updateAssistant(
              failActiveTurn(activeTurn, "The response ended unexpectedly. Please try again.")
            )
          }

          finish()
        },
      })

      if (didFinish) {
        subscription.dispose()
        return
      }

      activeSubscription.current = subscription
      restartIdleTimeout()
    },
    [
      abort,
      authenticationToken,
      environment,
      trackMessageSent,
      trackResponseReceived,
      trackTurnFailed,
      userID,
    ]
  )

  return { isResponding, messages, startNewConversation, submit }
}

export const reduceActiveTurn = (turn: ActiveTurn, event: NormalizedAgentEvent): ActiveTurn => {
  switch (event.__typename) {
    case "AIAgentTextDelta":
      return { ...turn, streamedText: turn.streamedText + event.text }
    case "AIAgentToolCall":
      return {
        ...turn,
        message: setActivity(turn.message, activityCopy(event.activity)),
      }
    case "AIAgentToolResult":
      // Keep the last activity visible. Tool call and result events can arrive in the same
      // network chunk, so replacing it with Thinking here could prevent it from rendering at all.
      return turn
    case "AIAgentTurnComplete": {
      const text = event.message ?? turn.streamedText

      if (!text) {
        return failActiveTurn(
          { ...turn, didReceiveTerminalEvent: true },
          stopReasonMessage(event.stopReason)
        )
      }

      const artworks = event.artworks ?? []
      const artworkIDs = artworks.map((artwork) => artwork.internalID)

      return {
        ...turn,
        didReceiveTerminalEvent: true,
        message: {
          ...turn.message,
          text,
          phase: "complete",
          activity: undefined,
          artworkRail: artworks.length > 0 ? { status: "ready", artworkIDs } : undefined,
        },
      }
    }
    default:
      return turn
  }
}

export const toHistory = (messages: ArtAssistantMessage[]): ArtAssistantHistoryEntry[] =>
  messages.flatMap<ArtAssistantHistoryEntry>((message) => {
    if (message.role === "user") {
      return [{ role: "USER" as const, content: message.text }]
    }

    if (message.phase !== "complete" || !message.text) {
      return []
    }

    return [
      {
        role: "ASSISTANT" as const,
        content: message.text,
        artworkIDs:
          message.artworkRail?.status === "ready" ? message.artworkRail.artworkIDs : undefined,
      },
    ]
  })

const activityCopy = (activity: AIAgentActivity) =>
  activity === "%future added value" ? ACTIVITY_COPY.THINKING : ACTIVITY_COPY[activity]

const setActivity = (message: AssistantMessage, activity: string): AssistantMessage =>
  message.activity === activity ? message : { ...message, activity }

const failActiveTurn = (turn: ActiveTurn, errorMessage: string): ActiveTurn => ({
  ...turn,
  message: {
    ...turn.message,
    phase: "error",
    activity: undefined,
    artworkRail: undefined,
    errorMessage,
  },
})
