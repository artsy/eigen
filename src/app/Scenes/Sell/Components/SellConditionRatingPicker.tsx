import { Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { ScrollView } from "react-native"

export type SellConditionRating = "POOR" | "FAIR" | "VERY_GOOD" | "EXCELLENT"

const CARD_WIDTH = 160

const RATINGS: { value: SellConditionRating; title: string; description: string }[] = [
  {
    value: "POOR",
    title: "Poor",
    description: "Significant damage or wear; will need conservation.",
  },
  {
    value: "FAIR",
    title: "Fair",
    description: "Some visible wear or light restoration; structurally sound.",
  },
  {
    value: "VERY_GOOD",
    title: "Very Good",
    description: "Minor, expected wear consistent with age; no conservation needed.",
  },
  {
    value: "EXCELLENT",
    title: "Excellent",
    description: "No visible wear; in original, pristine condition.",
  },
]

interface SellConditionRatingPickerProps {
  value: SellConditionRating | null
  onChange: (rating: SellConditionRating) => void
}

export const SellConditionRatingPicker: React.FC<SellConditionRatingPickerProps> = ({
  value,
  onChange,
}) => {
  const space = useSpace()

  return (
    <ScrollView
      horizontal
      accessibilityRole="radiogroup"
      showsHorizontalScrollIndicator={false}
      // Otherwise the first tap with the keyboard open only closes the keyboard
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
    >
      {RATINGS.map((rating) => {
        const checked = rating.value === value

        return (
          <Touchable
            key={rating.value}
            accessibilityRole="radio"
            accessibilityState={{ checked }}
            accessibilityLabel={`${rating.title}. ${rating.description}`}
            onPress={() => onChange(rating.value)}
          >
            <Flex
              width={CARD_WIDTH}
              flexGrow={1}
              p={2}
              gap={1}
              borderWidth={checked ? 2 : 1}
              borderColor={checked ? "blue100" : "mono10"}
            >
              <Text variant="sm-display" weight="medium">
                {rating.title}
              </Text>
              <Text variant="xs" color="mono60">
                {rating.description}
              </Text>
            </Flex>
          </Touchable>
        )
      })}
    </ScrollView>
  )
}
