import { Text } from "@artsy/palette-mobile"

export type OnboardingProgressUnit = "follows" | "saves"

const getProgressText = (unit: OnboardingProgressUnit, total: number) => {
  switch (unit) {
    case "follows":
      return `of ${total} follows`
    case "saves":
      return `of ${total} saves`
  }
}

interface OnboardingProgressBadgeProps {
  current: number
  total: number
  unit: OnboardingProgressUnit
}

export const OnboardingProgressBadge: React.FC<OnboardingProgressBadgeProps> = ({
  current,
  total,
  unit,
}) => {
  if (current >= total) {
    return (
      <Text variant="sm-display" color="blue100">
        Complete
      </Text>
    )
  }

  return (
    <Text variant="sm-display" color="mono100">
      <Text variant="sm-display" weight="medium" color="blue100">
        {current}
      </Text>
      {` ${getProgressText(unit, total)}`}
    </Text>
  )
}
