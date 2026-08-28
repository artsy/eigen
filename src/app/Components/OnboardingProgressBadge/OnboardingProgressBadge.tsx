import { Flex, Text } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { Easing } from "react-native-reanimated"

export type OnboardingProgressUnit = "follows" | "saves"

const getProgressText = (unit: OnboardingProgressUnit, total: number) => {
  switch (unit) {
    case "follows":
      return `of ${total} follows`
    case "saves":
      return `of ${total} saves`
  }
}

const JUMP_HEIGHT = 6
const UNDERSHOOT_DEPTH = 2

const JUMP_UP_DURATION = 100
const FALL_TO_FLOOR_DURATION = 70
const PAST_FLOOR_DURATION = 40
const SPRING_SETTLE_DURATION = 80

const TIME_TO_HIT_FLOOR = JUMP_UP_DURATION + FALL_TO_FLOOR_DURATION
const JUMP_AND_LAND_DURATION = TIME_TO_HIT_FLOOR + PAST_FLOOR_DURATION + SPRING_SETTLE_DURATION

const JUMP_SEQUENCE = [
  // rise up off the baseline
  {
    value: -JUMP_HEIGHT,
    type: "timing" as const,
    duration: JUMP_UP_DURATION,
    easing: Easing.out(Easing.ease),
  },
  // fall back down to the baseline (this is "hitting the floor")
  {
    value: 0,
    type: "timing" as const,
    duration: FALL_TO_FLOOR_DURATION,
    easing: Easing.in(Easing.ease),
  },
  // keep going slightly past the baseline
  {
    value: UNDERSHOOT_DEPTH,
    type: "timing" as const,
    duration: PAST_FLOOR_DURATION,
    easing: Easing.out(Easing.ease),
  },
  // spring back up to rest
  {
    value: 0,
    type: "timing" as const,
    duration: SPRING_SETTLE_DURATION,
    easing: Easing.out(Easing.ease),
  },
]

interface OnboardingProgressBadgeProps {
  current: number
  total: number
  unit: OnboardingProgressUnit
}

export const OnboardingProgressBadge: React.FC<OnboardingProgressBadgeProps> = ({
  current: currentCount,
  total,
  unit,
}) => {
  const [isJumping, setIsJumping] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(currentCount)

  // starts the jump when currentCount increases, or updates displayedCount directly otherwise
  useLayoutEffect(() => {
    if (currentCount > displayedCount) {
      setIsJumping(true)
    } else {
      setDisplayedCount(currentCount)
    }
  }, [currentCount, displayedCount])

  // schedules the mid-jump number swap and the end-of-animation reset
  useEffect(() => {
    if (!isJumping) return

    // swap the number in right as the jump touches down
    const hitFloorTimeout = setTimeout(() => setDisplayedCount(currentCount), TIME_TO_HIT_FLOOR)
    // reset once the whole sequence has finished
    const landedTimeout = setTimeout(() => setIsJumping(false), JUMP_AND_LAND_DURATION)

    return () => {
      clearTimeout(hitFloorTimeout)
      clearTimeout(landedTimeout)
    }
  }, [isJumping, currentCount])

  // stable reference while isJumping is unchanged, so the number swap doesn't restart the sequence
  const jumpAnimationProps = useMemo(
    () => ({
      from: { transform: [{ translateY: 0 }] },
      animate: { transform: [{ translateY: isJumping ? JUMP_SEQUENCE : 0 }] },
    }),
    [isJumping]
  )

  if (displayedCount >= total) {
    return (
      <Text variant="sm-display" color="blue100">
        Complete
      </Text>
    )
  }

  return (
    <Flex flexDirection="row" alignItems="baseline">
      <MotiView {...jumpAnimationProps}>
        <Text
          variant="sm-display"
          weight="medium"
          color="blue100"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {displayedCount}
        </Text>
      </MotiView>
      <Text variant="sm-display" color="mono100">
        {` ${getProgressText(unit, total)}`}
      </Text>
    </Flex>
  )
}
