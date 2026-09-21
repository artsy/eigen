import {
  ActionType,
  ArtAssistantTurnFailed,
  ContextModule,
  OwnerType,
  ReceivedArtAssistantResponse,
  SentArtAssistantMessage,
  TappedArtAssistantNewChat,
  TappedArtAssistantSuggestion,
} from "@artsy/cohesion"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useCallback } from "react"
import { useTracking } from "react-tracking"

interface MessageSent {
  conversationID: string
  message: string
  messageID: string
  messageIndex: number
  type: SentArtAssistantMessage["type"]
}

interface ResponseReceived {
  conversationID: string
  durationMs: number
  itemIDs: string[]
  itemType?: ReceivedArtAssistantResponse["item_type"]
  messageID: string
  promptMessageID: string
  response: string
  stopReason: string
  toolCallCount: number
}

interface TurnFailed {
  conversationID: string
  durationMs: number
  errorStatus?: number
  messageID: string
  outcome: ArtAssistantTurnFailed["outcome"]
  promptMessageID: string
  stopReason?: string
}

/**
 * Art Assistant tracking. Everything but the message and response text is always sent; the text
 * itself is user and agent content, so it only rides along while the
 * `onyx_send-art-assistant-messages-to-segment` experiment is on. That gate lives in Unleash
 * rather than in echo so it can be turned off without an app release, and turning it off keeps
 * every other field: the counts, timings and failure rates survive a decision not to collect
 * the content.
 */
export const useArtAssistantTracking = () => {
  const { trackEvent } = useTracking()
  const canTrackMessageContent = !!useExperimentFlag("onyx_send-art-assistant-messages-to-segment")

  const trackSuggestionTapped = useCallback(
    (suggestion: string, position: number) => {
      const payload: TappedArtAssistantSuggestion = {
        action: ActionType.tappedArtAssistantSuggestion,
        context_module: ContextModule.artAssistantSuggestions,
        context_screen_owner_type: OwnerType.artAssistant,
        position,
        suggestion,
      }

      trackEvent(payload)
    },
    [trackEvent]
  )

  const trackNewChat = useCallback(
    (conversationID: string, messageCount: number) => {
      const payload: TappedArtAssistantNewChat = {
        action: ActionType.tappedArtAssistantNewChat,
        context_module: ContextModule.artAssistant,
        context_screen_owner_type: OwnerType.artAssistant,
        conversation_id: conversationID,
        message_count: messageCount,
      }

      trackEvent(payload)
    },
    [trackEvent]
  )

  const trackMessageSent = useCallback(
    ({ conversationID, message, messageID, messageIndex, type }: MessageSent) => {
      const payload: SentArtAssistantMessage = {
        action: ActionType.sentArtAssistantMessage,
        character_count: message.length,
        context_module: ContextModule.artAssistant,
        context_screen_owner_type: OwnerType.artAssistant,
        conversation_id: conversationID,
        message_id: messageID,
        message_index: messageIndex,
        type,
        ...(canTrackMessageContent ? { message } : {}),
      }

      trackEvent(payload)
    },
    [canTrackMessageContent, trackEvent]
  )

  const trackResponseReceived = useCallback(
    ({
      conversationID,
      durationMs,
      itemIDs,
      itemType,
      messageID,
      promptMessageID,
      response,
      stopReason,
      toolCallCount,
    }: ResponseReceived) => {
      const payload: ReceivedArtAssistantResponse = {
        action: ActionType.receivedArtAssistantResponse,
        context_module: ContextModule.artAssistant,
        context_screen_owner_type: OwnerType.artAssistant,
        conversation_id: conversationID,
        duration_ms: durationMs,
        item_count: itemIDs.length,
        item_ids: itemIDs,
        message_id: messageID,
        prompt_message_id: promptMessageID,
        stop_reason: stopReason,
        tool_call_count: toolCallCount,
        ...(itemType ? { item_type: itemType } : {}),
        ...(canTrackMessageContent ? { response } : {}),
      }

      trackEvent(payload)
    },
    [canTrackMessageContent, trackEvent]
  )

  const trackTurnFailed = useCallback(
    ({
      conversationID,
      durationMs,
      errorStatus,
      messageID,
      outcome,
      promptMessageID,
      stopReason,
    }: TurnFailed) => {
      const payload: ArtAssistantTurnFailed = {
        action: ActionType.artAssistantTurnFailed,
        context_module: ContextModule.artAssistant,
        context_screen_owner_type: OwnerType.artAssistant,
        conversation_id: conversationID,
        duration_ms: durationMs,
        message_id: messageID,
        outcome,
        prompt_message_id: promptMessageID,
        ...(errorStatus ? { error_status: errorStatus } : {}),
        ...(stopReason ? { stop_reason: stopReason } : {}),
      }

      trackEvent(payload)
    },
    [trackEvent]
  )

  return {
    trackMessageSent,
    trackNewChat,
    trackResponseReceived,
    trackSuggestionTapped,
    trackTurnFailed,
  }
}
