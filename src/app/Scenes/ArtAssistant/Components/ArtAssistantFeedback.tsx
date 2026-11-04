import { DEFAULT_HIT_SLOP, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ThumbIcon } from "app/Components/Icons/ThumbIcon"
import { ArtAssistantFeedbackRating } from "app/Scenes/ArtAssistant/types"
import { AccessibilityInfo, Platform } from "react-native"

const FEEDBACK_ICON_SIZE = 16
const THANKS = "Thanks for the feedback"

const OPTIONS = [
  { rating: "THUMBS_UP", direction: "up", label: "Good response" },
  { rating: "THUMBS_DOWN", direction: "down", label: "Bad response" },
] as const

interface ArtAssistantFeedbackProps {
  rating?: ArtAssistantFeedbackRating
  onRate: (rating: ArtAssistantFeedbackRating) => void
}

export const ArtAssistantFeedback: React.FC<ArtAssistantFeedbackProps> = ({ rating, onRate }) => (
  <Flex flexDirection="row" alignItems="center" gap={2} mt={1} testID="art-assistant-feedback">
    <Text variant="xs" color="mono60" accessibilityLiveRegion="polite">
      {rating ? THANKS : "Was this helpful?"}
    </Text>

    {OPTIONS.map((option) => {
      const isSelected = rating === option.rating

      return (
        <Touchable
          key={option.rating}
          accessibilityLabel={option.label}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          hitSlop={DEFAULT_HIT_SLOP}
          onPress={() => {
            // Android reads the text's live region; iOS needs an explicit announcement.
            if (Platform.OS === "ios") {
              AccessibilityInfo.announceForAccessibility(THANKS)
            }
            onRate(option.rating)
          }}
          underlayColor="transparent"
        >
          <ThumbIcon
            direction={option.direction}
            filled={isSelected}
            color={isSelected ? "mono100" : "mono60"}
            width={FEEDBACK_ICON_SIZE}
            height={FEEDBACK_ICON_SIZE}
          />
        </Touchable>
      )
    })}
  </Flex>
)
