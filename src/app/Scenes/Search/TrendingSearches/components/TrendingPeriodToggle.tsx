import { Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { TrendingPeriod } from "app/Scenes/Search/TrendingSearches/useTrendingSearches"

const PERIOD_OPTIONS: readonly { period: TrendingPeriod; label: string }[] = [
  { period: "ONE_DAY", label: "Today" },
  { period: "SEVEN_DAYS", label: "Past 7 Days" },
  { period: "THIRTY_DAYS", label: "Past 30 Days" },
]

interface TrendingPeriodToggleProps {
  value: TrendingPeriod
  onChange: (period: TrendingPeriod) => void
}

export const TrendingPeriodToggle: React.FC<TrendingPeriodToggleProps> = ({ value, onChange }) => {
  const space = useSpace()

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={1}
      pt={1}
      pb={2}
      style={{ paddingHorizontal: space(2) }}
    >
      {PERIOD_OPTIONS.map(({ period, label }) => {
        const selected = period === value

        return (
          <Touchable
            key={period}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => onChange(period)}
          >
            <Flex
              px={1}
              py={0.5}
              borderRadius={16}
              backgroundColor={selected ? "mono10" : "transparent"}
            >
              <Text variant="xs" color={selected ? "mono100" : "mono60"}>
                {label}
              </Text>
            </Flex>
          </Touchable>
        )
      })}
    </Flex>
  )
}
