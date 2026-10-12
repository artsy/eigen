import { SparklesStrokeIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ArtAssistantArtworkRail } from "app/Scenes/ArtAssistant/Components/ArtAssistantArtworkRail"
import { ArtAssistantMessage as ArtAssistantMessageType } from "app/Scenes/ArtAssistant/types"

interface ArtAssistantMessageProps {
  message: ArtAssistantMessageType
  /** Only passed for the latest answer, so older turns don't offer replies */
  onSelectSuggestedReply?: (reply: string, position: number, responseMessageID: string) => void
}

export const ArtAssistantMessage: React.FC<ArtAssistantMessageProps> = ({
  message,
  onSelectSuggestedReply,
}) => {
  const isUser = message.role === "user"

  if (message.role === "assistant" && message.phase === "responding") {
    return <ArtAssistantActivityStatus text={message.activity ?? "Thinking..."} />
  }

  return (
    <Flex alignItems={isUser ? "flex-end" : "flex-start"}>
      <Flex
        alignSelf={isUser ? "flex-end" : "flex-start"}
        backgroundColor={isUser ? "mono100" : "mono10"}
        borderRadius={15}
        maxWidth="75%"
        px={1}
        py={1}
        testID={`art-assistant-${message.role}-message`}
      >
        <Text color={isUser ? "mono0" : "mono100"} variant="sm">
          {message.text}
        </Text>
      </Flex>

      {message.role === "assistant" && !!message.artworkRail && (
        <Flex alignSelf="stretch" mt={1} mx={-2}>
          <ArtAssistantArtworkRail state={message.artworkRail} />
        </Flex>
      )}

      {message.role === "assistant" &&
        message.phase === "complete" &&
        !!onSelectSuggestedReply &&
        !!message.suggestedReplies?.length && (
          <ArtAssistantSuggestedReplies
            replies={message.suggestedReplies}
            onSelect={(reply, position) => onSelectSuggestedReply(reply, position, message.id)}
          />
        )}
    </Flex>
  )
}

const SUGGESTIONS_ICON_SIZE = 16

const ArtAssistantSuggestedReplies: React.FC<{
  replies: string[]
  onSelect: (reply: string, position: number) => void
}> = ({ replies, onSelect }) => (
  <Flex
    alignItems="flex-start"
    alignSelf="stretch"
    gap={1}
    mt={2}
    testID="art-assistant-suggested-replies"
  >
    <Flex flexDirection="row" alignItems="center">
      <SparklesStrokeIcon
        fill="mono60"
        width={SUGGESTIONS_ICON_SIZE}
        height={SUGGESTIONS_ICON_SIZE}
      />
      <Text variant="xs" color="mono60" ml={0.5}>
        Suggestions
      </Text>
    </Flex>

    <Flex flexDirection="row" flexWrap="wrap" gap={1}>
      {replies.map((reply, index) => (
        <Touchable
          accessibilityHint="Sends this as your next message"
          accessibilityRole="button"
          key={`${index}-${reply}`}
          onPress={() => onSelect(reply, index)}
          underlayColor="mono5"
          style={{ borderRadius: 25, maxWidth: "85%", overflow: "hidden" }}
        >
          <Flex borderColor="mono100" borderRadius={25} borderWidth={1} px={2} py={1}>
            <Text variant="sm">{reply}</Text>
          </Flex>
        </Touchable>
      ))}
    </Flex>
  </Flex>
)

const ArtAssistantActivityStatus: React.FC<{ text: string }> = ({ text }) => (
  <Flex alignItems="flex-start">
    <Flex
      accessibilityLiveRegion="polite"
      alignSelf="flex-start"
      backgroundColor="mono5"
      borderRadius={15}
      maxWidth="75%"
      px={1}
      py={0.5}
      testID="art-assistant-activity-status"
    >
      <Text color="mono60" variant="xs">
        {text}
      </Text>
    </Flex>
  </Flex>
)
