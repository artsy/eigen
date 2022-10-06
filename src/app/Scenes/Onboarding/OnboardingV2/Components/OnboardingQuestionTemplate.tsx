import { useFocusEffect, useNavigation } from "@react-navigation/native"
import {
  OnboardingContextAction,
  State,
  useOnboardingContext,
} from "app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingContext"
import { Box, Button, CheckCircleFillIcon, Flex, ProgressBar, Screen, Spacer, Text } from "palette"
import { FC, useCallback, useState } from "react"
import { AnimatedFadingPill, FADE_OUT_PILL_ANIMATION_DURATION } from "./AnimatedFadingPill"

interface OnboardingQuestionTemplateProps {
  answers: string[]
  action: Exclude<OnboardingContextAction["type"], "RESET">
  onNext: () => void
  question: string
  subtitle?: string
}

const NAVIGATE_TO_NEXT_SCREEN_DELAY = 500
const ADD_TICK_AND_ANIMATE_PROGRESS_BAR_DELAY = FADE_OUT_PILL_ANIMATION_DURATION + 200

export const OnboardingQuestionTemplate: FC<OnboardingQuestionTemplateProps> = ({
  answers,
  action,
  onNext,
  question,
  subtitle,
}) => {
  const { canGoBack, goBack } = useNavigation()
  const { dispatch, back, next, onDone, progress, state } = useOnboardingContext()
  const [showPillTick, setShowPillTick] = useState(false)
  const [hideUnselectedPills, setHideUnselectedPills] = useState(false)
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false)

  const stateKey = STATE_KEYS[action]
  const selected = (answer: string) =>
    typeof state[stateKey] === "object"
      ? state[stateKey]?.includes(answer)
      : state[stateKey] === answer

  const navigateToNextScreen = useCallback(
    () =>
      setTimeout(() => {
        onNext()
      }, NAVIGATE_TO_NEXT_SCREEN_DELAY),
    [onNext]
  )

  const handleNext = useCallback(() => {
    // force disable next button
    setIsNextBtnDisabled(true)
    // trigger the fade out animation in the unselected pill components
    setHideUnselectedPills(true)

    setTimeout(() => {
      setShowPillTick(true)
      next()

      navigateToNextScreen()
    }, ADD_TICK_AND_ANIMATE_PROGRESS_BAR_DELAY)
  }, [next, navigateToNextScreen])

  const handleBack = useCallback(() => {
    back()

    if (canGoBack()) {
      goBack()
    }
  }, [back])

  useFocusEffect(
    useCallback(() => {
      setIsNextBtnDisabled(false)
      setHideUnselectedPills(false)
      setShowPillTick(false)
    }, [])
  )

  const isDisabled = isNextBtnDisabled || !state[stateKey] || state[stateKey]?.length === 0

  return (
    <Screen>
      <Screen.Header onBack={handleBack} onSkip={onDone} />
      <Screen.Body>
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
