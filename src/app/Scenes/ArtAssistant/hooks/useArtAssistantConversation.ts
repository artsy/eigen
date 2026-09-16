import {
  ArtAssistantAgentTurnSubscription,
  ArtAssistantAgentTurnSubscription$variables,
} from "__generated__/ArtAssistantAgentTurnSubscription.graphql"
import { artAssistantAgentTurnSubscription } from "app/Scenes/ArtAssistant/transport/ArtAssistantAgentTurnSubscription"
import {
  ArtAssistantTurnFailure,
  reportArtAssistantTurnFailure,
  stopReasonMessage,
  subscriptionErrorMessage,
} from "app/Scenes/ArtAssistant/utils/artAssistantErrors"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback, useEffect, useRef, useState } from "react"
import { requestSubscription, useRelayEnvironment } from "react-relay"
import { v4 as uuid } from "uuid"

export const ART_ASSISTANT_TURN_IDLE_TIMEOUT_MS = 60_000

/**
 * Minimal consumer for the Art Assistant subscription transport. Message history, activity
 * states, and artwork presentation are layered on separately from the transport integration.
 */
export const useArtAssistantConversation = () => {
  const environment = useRelayEnvironment()
  const userID = GlobalStore.useAppState((state) => state.auth.userID)
  const authenticationToken = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const conversationID = useRef(uuid())
  const activeSubscription = useRef<ReturnType<typeof requestSubscription> | null>(null)
  const responseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRespondingRef = useRef(false)
  const [isResponding, setIsResponding] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const abort = useCallback(() => {
    activeSubscription.current?.dispose()
    activeSubscription.current = null

    if (responseTimeout.current) {
      clearTimeout(responseTimeout.current)
      responseTimeout.current = null
    }
  }, [])

  useEffect(() => abort, [abort])

  const submit = useCallback(
    (prompt: string) => {
      const message = prompt.trim()

      if (!message || isRespondingRef.current) {
        return
      }

      if (!userID || !authenticationToken) {
        setResponse("Please sign in again to use Art Assistant.")
        return
      }

      abort()
      isRespondingRef.current = true
      setIsResponding(true)
      setResponse("Thinking...")

      const input = { conversationID: conversationID.current, message, history: [] }
      const variables: ArtAssistantAgentTurnSubscription$variables = { input }
      let streamedText = ""
      let didReceiveTerminalEvent = false
      let didFinish = false
      let subscription: ReturnType<typeof requestSubscription> | null = null
      let timeout: ReturnType<typeof setTimeout> | null = null

      const reportFailure = (failure: Omit<ArtAssistantTurnFailure, "conversationID">) =>
        reportArtAssistantTurnFailure({ ...failure, conversationID: input.conversationID })

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

        isRespondingRef.current = false
        setIsResponding(false)
      }

      const failIdleTurn = () => {
        subscription?.dispose()
        reportFailure({ outcome: "idle_timeout" })
        setResponse("This is taking longer than expected. Please try again.")
        finish()
      }

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

          if (event?.__typename === "AIAgentTextDelta") {
            streamedText += event.text
          }

          if (event?.__typename === "AIAgentTurnComplete") {
            didReceiveTerminalEvent = true
            const text = event.message ?? streamedText

            setResponse(text || stopReasonMessage(event.stopReason))
            subscription?.dispose()
            finish()
          }
        },
        onError: (error) => {
          reportFailure({ outcome: "stream_error", error })
          setResponse(subscriptionErrorMessage(error))
          finish()
        },
        onCompleted: () => {
          if (!didReceiveTerminalEvent) {
            reportFailure({ outcome: "ended_without_answer" })
            setResponse("The response ended unexpectedly. Please try again.")
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
    [abort, authenticationToken, environment, userID]
  )

  return { isResponding, response, submit }
}
