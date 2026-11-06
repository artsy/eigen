import {
  ThumbsDownFillIcon,
  ThumbsDownStrokeIcon,
  ThumbsUpFillIcon,
  ThumbsUpStrokeIcon,
} from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { ArtAssistantFeedbackRating } from "app/Scenes/ArtAssistant/types"
import { useEffect, useRef } from "react"
import { AccessibilityInfo, Platform } from "react-native"

const FEEDBACK_ICON_SIZE = 24

const OPTIONS = [
  {
    rating: "THUMBS_UP",
    label: "Good response",
    FillIcon: ThumbsUpFillIcon,
    StrokeIcon: ThumbsUpStrokeIcon,
  },
  {
    rating: "THUMBS_DOWN",
    label: "Bad response",
    FillIcon: ThumbsDownFillIcon,
    StrokeIcon: ThumbsDownStrokeIcon,
  },
] as const

interface ArtAssistantFeedbackProps {
  rating?: ArtAssistantFeedbackRating
  onRate: (rating: ArtAssistantFeedbackRating) => void
}

export const ArtAssistantFeedback: React.FC<ArtAssistantFeedbackProps> = ({ rating, onRate }) => {
  const prompt = rating ? "Thanks for the feedback" : "Was this helpful?"
  const previousPrompt = useRef(prompt)

  // Android reads changes through the live region; iOS needs them announced.
  useEffect(() => {
    if (Platform.OS === "ios" && prompt !== previousPrompt.current) {
      AccessibilityInfo.announceForAccessibility(prompt)
    }
    previousPrompt.current = prompt
  }, [prompt])

  return (
    <Flex alignSelf="stretch" mt={2} testID="art-assistant-feedback">
      <Separator />

      <Flex flexDirection="row" alignItems="center" gap={2} mt={1}>
        <Text variant="xs" color="mono60" accessibilityLiveRegion="polite">
          {prompt}
        </Text>

        {OPTIONS.map((option) => {
          const isSelected = rating === option.rating
          const Icon = isSelected ? option.FillIcon : option.StrokeIcon

          return (
            <Touchable
              key={option.rating}
              accessibilityLabel={option.label}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={() => onRate(option.rating)}
              underlayColor="transparent"
            >
              <Icon
                fill={isSelected ? "mono100" : "mono60"}
                width={FEEDBACK_ICON_SIZE}
                height={FEEDBACK_ICON_SIZE}
              />
            </Touchable>
          )
        })}
      </Flex>
    </Flex>
  )
}
