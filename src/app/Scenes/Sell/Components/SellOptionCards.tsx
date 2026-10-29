import { Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { ScrollView } from "react-native"

const CARD_WIDTH = 160

export interface SellOption<T extends string> {
  value: T
  title: string
  description: string
}

interface SellOptionCardsProps<T extends string> {
  options: SellOption<T>[]
  value: T | null
  onChange: (value: T) => void
  disabled?: boolean
}

export const SellOptionCards = <T extends string>({
  options,
  value,
  onChange,
  disabled = false,
}: SellOptionCardsProps<T>) => {
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
      {options.map((option) => {
        const checked = option.value === value

        return (
          <Touchable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked, disabled }}
            accessibilityLabel={`${option.title}. ${option.description}`}
            disabled={disabled}
            onPress={() => onChange(option.value)}
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
                {option.title}
              </Text>
              <Text variant="xs" color="mono60">
                {option.description}
              </Text>
            </Flex>
          </Touchable>
        )
      })}
    </ScrollView>
  )
}
