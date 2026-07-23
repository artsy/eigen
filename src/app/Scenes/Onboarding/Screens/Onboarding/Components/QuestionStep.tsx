import { Button, Flex, Pill, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { MotiView } from "moti"
import { useState } from "react"
import Animated, { Easing, FadeInUp } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Logo } from "./Logo"

export type Experience = "experienced" | "beginner"

const EXPERIENCE_OPTIONS: { label: string; experience: Experience }[] = [
  { label: "I'm an experienced collector (4+ works)", experience: "experienced" },
  { label: "I've started my collection (1-3 works)", experience: "experienced" },
  { label: "I'm new to collecting, but I have something in mind", experience: "beginner" },
  { label: "I'm new to collecting and ready to explore", experience: "beginner" },
]

const HORIZONTAL_MARGIN = 20
const QUESTION_HEIGHT = 64
const QUESTION_TOP_OFFSET = 70
const QUESTION_SUBTITLE_GAP = 10
const SUBTITLE_ANSWERS_GAP = 34

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

  const subtitleTop = questionEndTop + QUESTION_HEIGHT + QUESTION_SUBTITLE_GAP
  const answersOffset = subtitleTop + SUBTITLE_ANSWERS_GAP

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
          Where are you in your art collecting journey?
        </Text>
      </MotiView>

      {!!questionSettled && (
        <Animated.View
          entering={FadeInUp.duration(400).easing(Easing.out(Easing.quad))}
          style={{
            position: "absolute",
            top: subtitleTop,
            left: HORIZONTAL_MARGIN,
            right: HORIZONTAL_MARGIN,
          }}
        >
          <Text variant="xs" color="mono30">
            Please select one answer
          </Text>
        </Animated.View>
      )}

      {!!questionSettled && (
        <Animated.View
          entering={FadeInUp.duration(400).easing(Easing.out(Easing.quad))}
          style={{
            position: "absolute",
            top: answersOffset,
            bottom: answersOffset,
            left: HORIZONTAL_MARGIN,
            right: HORIZONTAL_MARGIN,
          }}
        >
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
                    <Text variant="xs" color="mono0" textAlign="center">
                      {label}
                    </Text>
                  </Pill>
                  <Spacer y={2} />
                </Flex>
              )
            })}
          </Flex>
        </Animated.View>
      )}

      {!!questionSettled && (
        <Animated.View
          entering={FadeInUp.duration(400).easing(Easing.out(Easing.quad))}
          style={{
            position: "absolute",
            bottom: 0,
            left: HORIZONTAL_MARGIN,
            right: HORIZONTAL_MARGIN,
          }}
        >
          <Flex pb={`${bottom}px`}>
            <Button variant="fillLight" block disabled={!selectedLabel} onPress={handleContinue}>
              Continue
            </Button>
          </Flex>
        </Animated.View>
      )}
    </Flex>
  )
}
