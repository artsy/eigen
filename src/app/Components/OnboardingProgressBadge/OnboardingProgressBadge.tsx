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
    <Flex borderRadius={50} borderWidth={1} borderColor="mono60" px={1} py={0.5}>
      <Text variant="xs">
        <Text variant="xs" fontWeight="500">
          {current}
        </Text>
        /{total}
      </Text>
    </Flex>
  )
}
