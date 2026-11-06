import { SparklesStrokeIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"

const SUGGESTIONS_ICON_SIZE = 16

interface ArtAssistantSuggestedRepliesProps {
  replies: string[]
  onSelect: (reply: string, position: number) => void
}

export const ArtAssistantSuggestedReplies: React.FC<ArtAssistantSuggestedRepliesProps> = ({
  replies,
  onSelect,
}) => (
  <Flex
    alignItems="flex-start"
    alignSelf="stretch"
    gap={1}
    mt={4}
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

    <Flex alignSelf="stretch" gap={1}>
      {replies.map((reply, index) => (
        <Touchable
          accessibilityHint="Sends this as your next message"
          accessibilityRole="button"
          key={`${index}-${reply}`}
          onPress={() => onSelect(reply, index)}
          underlayColor="mono5"
          style={{ borderRadius: 8, overflow: "hidden" }}
        >
          <Flex
            borderColor="mono15"
            borderRadius={8}
            borderWidth={1}
            justifyContent="center"
            minHeight={44}
            px={2}
            py={1}
          >
            <Text variant="sm">{reply}</Text>
          </Flex>
        </Touchable>
      ))}
    </Flex>
  </Flex>
)
