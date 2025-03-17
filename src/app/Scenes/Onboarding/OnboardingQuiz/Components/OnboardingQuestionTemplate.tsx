import {
  Spacer,
  CheckCircleFillIcon,
  Flex,
  Box,
  ProgressBar,
  Text,
  Button,
  LegacyScreen,
  Touchable,
  CloseIcon,
  ChevronIcon,
} from "@artsy/palette-mobile"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import {
  OnboardingContextAction,
  State,
  useOnboardingContext,
} from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { debounce } from "lodash"
import React, { FC, useCallback, useState } from "react"
import { LayoutAnimation } from "react-native"
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
      LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 200 })
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

  const androidHardwareBackButtonHandler = () => {
    handleBack()

    return true
  }

  // This is the hook that is used to override the back button behavior on Android
  // if we don't call this hook, the back button will crash the app
  useBackHandler(androidHardwareBackButtonHandler)

  const isDisabled = isNextBtnDisabled || !state[stateKey] || state[stateKey]?.length === 0

  const debouncedHandleSkip = debounce(onDone, 1000)

  return (
    <LegacyScreen>
      <LegacyScreen.Body>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" height={40}>
          <Touchable onPress={handleBack} hitSlop={{ left: 20, right: 20 }}>
            <ChevronIcon direction="left" />
          </Touchable>

          <Touchable
            testID="close-button"
            onPress={debouncedHandleSkip}
            hitSlop={{ left: 20, right: 20 }}
          >
            <CloseIcon />
          </Touchable>
        </Flex>

        <Box pt={2}>
          <ProgressBar progress={progress} />
        </Box>
        <Flex flex={1} flexDirection="column">
          <Spacer y={2} />
          <Text variant="lg-display">{question}</Text>
          {!!subtitle && (
            <>
              <Spacer y={1} />
              <Text variant="sm">{subtitle}</Text>
            </>
          )}
          <Spacer y={2} />
          {answers.map((answer, index) => {
            const isVisible = !hideUnselectedPills || !!selected(answer)
            const shouldShowPillTick = showPillTick && selected(answer)

            return (
              <React.Fragment key={`${answer}+${index}`}>
                <AnimatedFadingPill
                  variant="default"
                  isVisible={isVisible}
                  key={`${answer}-pill`}
                  Icon={!!shouldShowPillTick ? CheckCircleFillIconWhite : undefined}
                  onPress={() => dispatch({ type: action, payload: answer })}
                  selected={selected(answer)}
                >
                  {!!shouldShowPillTick && <Spacer x={1} />}
                  <Text variant="sm" color={selected(answer) ? "white100" : "black100"}>
                    {answer}
                  </Text>
                </AnimatedFadingPill>
                {!!isVisible && <Spacer y={2} />}
              </React.Fragment>
            )
          })}
        </Flex>
        <Flex>
          <Button block disabled={isDisabled} onPress={handleNext}>
            Next
          </Button>
          <LegacyScreen.SafeBottomPadding />
        </Flex>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}

const CheckCircleFillIconWhite = () => {
  return <CheckCircleFillIcon fill="white100" />
}

const STATE_KEYS: Record<Exclude<OnboardingContextAction["type"], "RESET">, keyof State> = {
  SET_ANSWER_ONE: "questionOne",
  SET_ANSWER_TWO: "questionTwo",
  SET_ANSWER_THREE: "questionThree",
  FOLLOW: "followedIds",
}
