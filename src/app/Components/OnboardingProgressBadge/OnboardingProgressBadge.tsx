import { Flex, Text, useTextStyleForPalette } from "@artsy/palette-mobile"

interface OnboardingProgressBadgeProps {
  current: number
  total: number
}

export const OnboardingProgressBadge: React.FC<OnboardingProgressBadgeProps> = ({
  current,
  total,
}) => {
  const textStyle = useTextStyleForPalette("sm-display")

  return (
    <Flex
      backgroundColor="blue100"
      borderRadius={30}
      // 1px vertical asymmetry compensates for Unica77's font metric offset
      style={{ paddingHorizontal: 15, paddingTop: 5, paddingBottom: 4 }}
      alignItems="center"
      justifyContent="center"
      alignSelf="flex-start"
    >
      {/* tabular-nums keeps all digits equal width so the pill doesn't resize as the count changes */}
      <Text color="mono0" style={{ ...textStyle, fontVariant: ["tabular-nums"] }}>
        {Math.min(current, total)}/{total}
      </Text>
    </Flex>
  )
}
