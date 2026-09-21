import { SparklesSquareStrokeIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useArtAssistantTracking } from "app/Scenes/ArtAssistant/hooks/useArtAssistantTracking"

const EMPTY_STATE_ICON_SIZE = 20

export const ART_ASSISTANT_SUGGESTIONS = [
  "Something similar to my taste, check out my saves for inspiration",
  "Large black and white paintings under $5K",
  "What's trending right now",
]

interface ArtAssistantEmptyStateProps {
  onSelectSuggestion: (suggestion: string) => void
}

export const ArtAssistantEmptyState: React.FC<ArtAssistantEmptyStateProps> = ({
  onSelectSuggestion,
}) => {
  const { trackSuggestionTapped } = useArtAssistantTracking()

  return (
    <Flex flex={1} pt={2}>
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <SparklesSquareStrokeIcon
          fill="mono60"
          width={EMPTY_STATE_ICON_SIZE}
          height={EMPTY_STATE_ICON_SIZE}
        />
        <Text variant="sm" color="mono60" ml={0.5}>
          Art Assistant
        </Text>

        <Flex backgroundColor="blue100" borderRadius={15} mb={1} ml={0.5} px={1} py={0.5}>
          <Text variant="xxs" color="mono0">
            Beta
          </Text>
        </Flex>
      </Flex>

      <Text variant="lg" textAlign="center" mt={2}>
        What are you looking for?
      </Text>

      <Text variant="sm" color="mono60" textAlign="center" mt={1} mb={2}>
        Describe it the way you'd describe it to a friend — medium, mood, color, budget. I'll do the
        filtering.
      </Text>

      <Flex gap={1}>
        {ART_ASSISTANT_SUGGESTIONS.map((suggestion, index) => (
          <Touchable
            accessibilityRole="button"
            key={suggestion}
            onPress={() => {
              trackSuggestionTapped(suggestion, index)
              onSelectSuggestion(suggestion)
            }}
            underlayColor="mono5"
            style={{ borderRadius: 20, overflow: "hidden" }}
          >
            <Flex
              borderColor="mono15"
              borderRadius={20}
              borderWidth={1}
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
