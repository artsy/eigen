import { Button, Flex, Pill, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useState } from "react"
import Animated, { Easing, FadeInUp } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Logo } from "./Logo"

export type Experience = "experienced" | "beginner"

const EXPERIENCE_OPTIONS: { label: string; experience: Experience }[] = [
  { label: "I have collected many works (4 or more)", experience: "experienced" },
  { label: "I have collected a few works (1-3)", experience: "experienced" },
  { label: "I'm just starting out but have something in mind", experience: "beginner" },
  { label: "I'm just starting out and want to explore", experience: "beginner" },
]

const HORIZONTAL_MARGIN = 20
const QUESTION_HEIGHT = 64
const QUESTION_TOP_OFFSET = 112
const QUESTION_SUBTITLE_GAP = 10

interface QuestionStepProps {
  onSelect: (experience: Experience, label: string) => void
}

export const QuestionStep: React.FC<QuestionStepProps> = ({ onSelect }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [questionSettled, setQuestionSettled] = useState(false)
  const { top, bottom } = useSafeAreaInsets()
  const { height: screenHeight } = useScreenDimensions()

  const handleContinue = () => {
    const option = EXPERIENCE_OPTIONS.find((o) => o.label === selectedLabel)
    if (option) onSelect(option.experience, option.label)
  }

  const questionEndTop = top + QUESTION_TOP_OFFSET
  const questionStartTop = screenHeight / 2 - QUESTION_HEIGHT / 2
  const translateYStart = questionStartTop - questionEndTop

  return (
    <Flex flex={1} backgroundColor="mono100">
      <Logo />

      <MotiView
        style={{
          position: "absolute",
          top: questionEndTop,
          left: HORIZONTAL_MARGIN,
          right: HORIZONTAL_MARGIN,
        }}
        from={{ translateY: translateYStart }}
        animate={{ translateY: 0 }}
        transition={{ type: "timing", duration: 600, easing: Easing.out(Easing.quad) }}
        onDidAnimate={(key, finished) => {
          if (key === "translateY" && finished) setQuestionSettled(true)
        }}
      >
        <Text variant="lg-display" color="mono0">
          What is your art collecting experience?
        </Text>
      </MotiView>

      {!!questionSettled && (
        <Animated.View
          entering={FadeInUp.duration(400).easing(Easing.out(Easing.quad))}
          style={{
            position: "absolute",
            top: questionEndTop + QUESTION_HEIGHT + QUESTION_SUBTITLE_GAP,
            left: HORIZONTAL_MARGIN,
            right: HORIZONTAL_MARGIN,
            bottom: 0,
          }}
        >
          <Flex flex={1} flexDirection="column">
            <Text variant="xs" color="mono30">
              Please select one answer
            </Text>
            <Flex flex={1} justifyContent="center">
              {EXPERIENCE_OPTIONS.map(({ label }) => {
                const isSelected = selectedLabel === label
                return (
                  <Flex key={label} alignSelf="flex-start">
                    <Pill
                      variant="onboarding"
                      selected={isSelected}
                      alignSelf="flex-start"
                      onPress={() => setSelectedLabel(label)}
                    >
                      <Text variant="xs" color="mono0">
                        {label}
                      </Text>
                    </Pill>
                    <Spacer y={2} />
                  </Flex>
                )
              })}
            </Flex>
            <Flex pb={`${bottom}px`}>
              <Button variant="fillLight" block disabled={!selectedLabel} onPress={handleContinue}>
                Continue
              </Button>
            </Flex>
          </Flex>
        </Animated.View>
      )}
    </Flex>
  )
}
