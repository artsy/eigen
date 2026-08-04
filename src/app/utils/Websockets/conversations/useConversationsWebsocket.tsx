import { GlobalStore } from "app/store/GlobalStore"
import { useCable } from "app/utils/Websockets/GravityWebsocketContext"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect, useRef } from "react"

export interface ConversationsWebsocketEvent {
  type?: string
  conversation_id?: string
  message_id?: string
  // True when the message was sent by the current user. Deliberately not
  // filtered out: the broadcast can't tell which device sent the message, so
  // skipping it would leave a message sent from another device (e.g. web)
  // invisible here until a manual refresh.
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
  /**
   * Called when the socket reconnects after a drop (network loss, app
   * backgrounded) or when the hook resubscribes after `enabled` was toggled
   * off. Anything broadcast in the meantime is lost, so consumers should
   * refetch here. Not called on the very first connection.
   */
  onConnected?: () => void
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
  onConnected,
}: UseConversationsWebsocketParams) => {
  const isFeatureEnabled = useFeatureFlag("AREnableConversationsRealtime")
  const userAccessToken = GlobalStore.useAppState((state) => state.auth.userAccessToken)
  const { cable, channelsHolder } = useCable()

  // Keep the latest callbacks without resubscribing on every render.
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent
  const onConnectedRef = useRef(onConnected)
  onConnectedRef.current = onConnected

  // Lives outside the effect so it survives resubscribes (e.g. `enabled`
  // toggling with screen focus). Only the very first connection is treated
  // as "initial"; a resubscribe's first `connected` fires `onConnected`,
  // which is exactly the catch-up refetch the consumer wants after having
  // been unsubscribed.
  const hasConnectedOnce = useRef(false)

  useEffect(() => {
    if (!isFeatureEnabled || !enabled || !cable || !channelsHolder || !userAccessToken) {
      return
    }

    const channelKey = `conversations:${subscriptionKey}`
    const subscription = cable.subscriptions.create({
      channel: "ConversationsChannel",
      access_token: userAccessToken,
      // Included only to keep simultaneous subscriptions' identifiers
      // unique; ignored by the server.
      key: subscriptionKey,
    })
    const channel = channelsHolder.setChannel(channelKey, subscription)

    if (!channel) {
      subscription.unsubscribe()
      return
    }

    const handleReceived = (event: ConversationsWebsocketEvent) => {
      onEventRef.current(event)
    }

    // "connected" also fires when the subscription is first confirmed;
    // consumers fetch on mount already, so skip that one.
    const handleConnected = () => {
      if (!hasConnectedOnce.current) {
        hasConnectedOnce.current = true
        return
      }
      onConnectedRef.current?.()
    }

    const handleRejected = () => {
      console.warn(`useConversationsWebsocket: subscription rejected for ${channelKey}`)
    }

    channel.on("received", handleReceived)
    channel.on("connected", handleConnected)
    channel.on("rejected", handleRejected)

    return () => {
      channel.removeListener("received", handleReceived)
      channel.removeListener("connected", handleConnected)
      channel.removeListener("rejected", handleRejected)
      channel.unsubscribe()
      delete channelsHolder.channels[channelKey]
    }
  }, [isFeatureEnabled, enabled, cable, channelsHolder, userAccessToken, subscriptionKey])
}
