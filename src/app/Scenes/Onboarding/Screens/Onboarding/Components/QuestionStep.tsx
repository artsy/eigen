import { Button, Flex, Spacer, Screen, Text } from "@artsy/palette-mobile"
import {
  AnimatedFadingPill,
  FADE_OUT_PILL_ANIMATION_DURATION,
  PillCheckmarkIcon,
  PillIconPlaceholder,
} from "app/Components/AnimatedFadingPill/AnimatedFadingPill"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type Experience = "experienced" | "beginner"

const EXPERIENCE_OPTIONS: { label: string; experience: Experience }[] = [
  { label: "I have collected many works (4 or more)", experience: "experienced" },
  { label: "I have collected a few works (1-3)", experience: "experienced" },
  { label: "I'm just starting out but have something in mind", experience: "beginner" },
  { label: "I'm just starting out and want to explore", experience: "beginner" },
]

const SHOW_TICK_DELAY = FADE_OUT_PILL_ANIMATION_DURATION + 200
const NAVIGATE_DELAY = SHOW_TICK_DELAY + 500

interface QuestionStepProps {
  onSelect: (experience: Experience) => void
}

export const QuestionStep: React.FC<QuestionStepProps> = ({ onSelect }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [hideUnselectedPills, setHideUnselectedPills] = useState(false)
  const [showPillTick, setShowPillTick] = useState(false)
  const { bottom } = useSafeAreaInsets()

  const handleContinue = () => {
    const option = EXPERIENCE_OPTIONS.find((o) => o.label === selectedLabel)
    if (!option) return

    setHideUnselectedPills(true)
    setTimeout(() => setShowPillTick(true), SHOW_TICK_DELAY)
    setTimeout(() => onSelect(option.experience), NAVIGATE_DELAY)
  }

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} flexDirection="column">
          <Spacer y={2} />
          <Text variant="lg-display">What is your art collecting experience?</Text>
          <Spacer y={2} />
          {EXPERIENCE_OPTIONS.map(({ label }) => {
            const isSelected = selectedLabel === label
            const isVisible = !hideUnselectedPills || isSelected
            const Icon = showPillTick && isSelected ? PillCheckmarkIcon : PillIconPlaceholder

            return (
              <Flex key={label}>
                <AnimatedFadingPill
                  isVisible={isVisible}
                  selected={isSelected}
                  Icon={Icon}
                  onPress={() => !hideUnselectedPills && setSelectedLabel(label)}
                >
                  <Text variant="sm" lineHeight="16px" color={isSelected ? "mono0" : "mono100"}>
                    {label}
                  </Text>
                </AnimatedFadingPill>
                {!!isVisible && <Spacer y={2} />}
              </Flex>
            )
          })}
        </Flex>
        <Flex pb={`${bottom}px`}>
          <Button block disabled={!selectedLabel || hideUnselectedPills} onPress={handleContinue}>
            Continue
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
