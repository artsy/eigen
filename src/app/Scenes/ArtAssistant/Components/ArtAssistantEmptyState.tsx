import { SparklesStrokeIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { StyleSheet } from "react-native"

const EMPTY_STATE_ICON_SIZE = 28

export const ART_ASSISTANT_SUGGESTIONS = [
  "Large blue abstract painting for a living room, under $10k",
  "Emerging photographers showing in Berlin right now",
  "Something like Ruth Asawa but I can actually afford",
]

interface ArtAssistantEmptyStateProps {
  onSelectSuggestion: (suggestion: string) => void
}

export const ArtAssistantEmptyState: React.FC<ArtAssistantEmptyStateProps> = ({
  onSelectSuggestion,
}) => {
  return (
    <Flex flex={1} pt={2}>
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <SparklesStrokeIcon
          fill="mono60"
          width={EMPTY_STATE_ICON_SIZE}
          height={EMPTY_STATE_ICON_SIZE}
        />
        <Text variant="sm" color="mono60" ml={0.5} caps>
          Art Assistant
        </Text>
      </Flex>

      <Text variant="lg" textAlign="center" mt={2}>
        What are you looking for?
      </Text>

      <Text variant="sm" color="mono60" textAlign="center" mt={1} mb={2}>
        Describe it the way you'd describe it to a friend — medium, mood, color, budget. I'll do the
        filtering.
      </Text>

      <Flex gap={1}>
        {ART_ASSISTANT_SUGGESTIONS.map((suggestion) => (
          <Touchable
            accessibilityRole="button"
            key={suggestion}
            onPress={() => onSelectSuggestion(suggestion)}
            underlayColor="mono5"
            style={{ borderRadius: 20, overflow: "hidden" }}
          >
            <Flex
              borderColor="mono15"
              borderRadius={20}
              borderWidth={StyleSheet.hairlineWidth}
              justifyContent="center"
              minHeight={56}
              px={2}
              py={1}
            >
              <Text variant="sm">{suggestion}</Text>
            </Flex>
          </Touchable>
        ))}
      </Flex>
    </Flex>
  )
}
