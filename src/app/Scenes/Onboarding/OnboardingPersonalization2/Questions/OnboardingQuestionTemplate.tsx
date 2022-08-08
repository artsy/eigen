import { useNavigation } from "@react-navigation/native"
import { Box, Button, CheckCircleFillIcon, Flex, ProgressBar, Screen, Spacer, Text } from "palette"
import { useState } from "react"
import { StatusBar } from "react-native"
import {
  AnimatedFadingPill,
  FADE_OUT_PILL_ANIMATION_DURATION,
} from "../Components/AnimatedFadingPill"
import { OnboardingContextAction, State, useOnboardingContext } from "../Hooks/useOnboardingContext"

interface OnboardingQuestionTemplateProps {
  answers: string[]
  action: Exclude<OnboardingContextAction["type"], "RESET">
  onNext: () => void
  question: string
  subtitle?: string
}

const NAVIGATE_TO_NEXT_SCREEN_DELAY = 500
const ADD_TICK_AND_ANIMATE_PROGRESS_BAR_DELAY = FADE_OUT_PILL_ANIMATION_DURATION + 200

export const OnboardingQuestionTemplate: React.FC<OnboardingQuestionTemplateProps> = ({
  answers,
  action,
  onNext,
  question,
  subtitle,
}) => {
  const { goBack } = useNavigation()
  const { dispatch, next, onDone, state, progress } = useOnboardingContext()
  const [showPillTick, setShowPillTick] = useState(false)
  const [hideUnselectedPills, setHideUnselectedPills] = useState(false)
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false)

  const stateKey = STATE_KEYS[action]
  const selected = (answer: string) =>
    typeof state[stateKey] === "object"
      ? state[stateKey]?.includes(answer)
      : state[stateKey] === answer

  const navigateToNextScreen = () =>
    setTimeout(() => {
      onNext()
    }, NAVIGATE_TO_NEXT_SCREEN_DELAY)

  const handleNext = () => {
    // force disable next button
    setIsNextBtnDisabled(true)
    // trigger the fade out animation in the unselected pill components
    setHideUnselectedPills(true)

    setTimeout(() => {
      setShowPillTick(true)
      next()

      navigateToNextScreen()
    }, ADD_TICK_AND_ANIMATE_PROGRESS_BAR_DELAY)
  }

  const isDisabled = isNextBtnDisabled || !state[stateKey] || state[stateKey]?.length === 0

  return (
    <Screen>
      <Screen.Header onBack={goBack} onSkip={onDone} />
      <Screen.Body>
        <StatusBar barStyle="dark-content" />
        <Box pt={2}>
          <ProgressBar progress={progress} />
        </Box>
        <Flex flex={1} flexDirection="column">
          <Spacer m={2} />
          <Text variant="lg">{question}</Text>
          {!!subtitle && (
            <>
              <Spacer m={1} />
              <Text variant="sm">{subtitle}</Text>
            </>
          )}
          <Spacer m={2} />
          {answers.map((answer) => (
            <AnimatedFadingPill
              mb={2}
              isVisible={!hideUnselectedPills || !!selected(answer)}
              key={`${answer}-pill`}
              rounded
              size="xs"
              Icon={showPillTick && selected(answer) ? CheckCircleFillIcon : undefined}
              iconPosition="left"
              onPress={() => dispatch({ type: action, payload: answer })}
              selected={selected(answer)}
            >
              {answer}
            </AnimatedFadingPill>
          ))}
        </Flex>
        <Flex>
          <Button block disabled={isDisabled} onPress={handleNext}>
            Next
          </Button>
          <Screen.SafeBottomPadding />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const STATE_KEYS: Record<Exclude<OnboardingContextAction["type"], "RESET">, keyof State> = {
  SET_ANSWER_ONE: "questionOne",
  SET_ANSWER_TWO: "questionTwo",
  SET_ANSWER_THREE: "questionThree",
  FOLLOW: "followedIds",
}
