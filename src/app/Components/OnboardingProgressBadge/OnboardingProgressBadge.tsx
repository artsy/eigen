import { Flex, Text } from "@artsy/palette-mobile"

interface OnboardingProgressBadgeProps {
  current: number
  total: number
}

export const OnboardingProgressBadge: React.FC<OnboardingProgressBadgeProps> = ({
  current,
  total,
}) => {
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
      <Text color="mono0" variant="sm-display" style={{ fontVariant: ["tabular-nums"] }}>
        {Math.min(current, total)}/{total}
      </Text>
    </Flex>
  )
}
