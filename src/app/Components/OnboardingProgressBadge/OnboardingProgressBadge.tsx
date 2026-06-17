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
      // paddingTop and paddingBottom are offset to center the text
      style={{ paddingHorizontal: 15, paddingTop: 5, paddingBottom: 8 }}
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
