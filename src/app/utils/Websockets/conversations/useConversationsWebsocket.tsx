import { GlobalStore } from "app/store/GlobalStore"
import { useCable } from "app/utils/Websockets/GravityWebsocketContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect, useRef } from "react"

export interface ConversationsWebsocketEvent {
  type?: string
  conversation_id?: string
  message_id?: string
  from_principal?: boolean
  created_at?: string
}

interface UseConversationsWebsocketParams {
  /**
   * Uniquely identifies this subscription so simultaneous subscribers (e.g.
   * the inbox list and an open conversation) each get their own channel.
   */
  subscriptionKey: string
  enabled?: boolean
  onEvent: (event: ConversationsWebsocketEvent) => void
}

/**
 * Subscribes to Gravity's ConversationsChannel, which broadcasts a minimal
 * signal (ids and timestamps, no message content) whenever a message is
 * delivered to one of the current user's conversations. Consumers are
 * expected to refetch over Relay in response.
 */
export const useConversationsWebsocket = ({
  subscriptionKey,
  enabled = true,
  onEvent,
}: UseConversationsWebsocketParams) => {
  const isFeatureEnabled = useFeatureFlag("AREnableConversationsRealtime")
  const userAccessToken = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const { cable, channelsHolder } = useCable()

  // Keep the latest callback without resubscribing on every render.
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  useEffect(() => {
    if (!isFeatureEnabled || !enabled || !cable || !channelsHolder || !userAccessToken) {
      return
    }

    const channelKey = `conversations:${subscriptionKey}`
    const channel = channelsHolder.setChannel(
      channelKey,
      cable.subscriptions.create({
        channel: "ConversationsChannel",
        access_token: userAccessToken,
        // Included only to keep simultaneous subscriptions' identifiers
        // unique; ignored by the server.
        key: subscriptionKey,
      })
    )

    if (!channel) {
      return
    }

    const handleReceived = (event: ConversationsWebsocketEvent) => {
      onEventRef.current(event)
    }

    channel.on("received", handleReceived)

    return () => {
      channel.removeListener("received", handleReceived)
      channel.unsubscribe()
      delete channelsHolder.channels[channelKey]
    }
  }, [isFeatureEnabled, enabled, cable, channelsHolder, userAccessToken, subscriptionKey])
}
