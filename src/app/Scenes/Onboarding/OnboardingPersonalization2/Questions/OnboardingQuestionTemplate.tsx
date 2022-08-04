import { useNavigation } from "@react-navigation/native"
import {
  Box,
  Button,
  CheckCircleFillIcon,
  Flex,
  Join,
  Pill,
  ProgressBar,
  Screen,
  Spacer,
  Text,
} from "palette"
import { FC, useState } from "react"
import { StatusBar } from "react-native"
import { OnboardingContextAction, State, useOnboardingContext } from "../Hooks/useOnboardingContext"

interface OnboardingQuestionTemplateProps {
  answers: string[]
  action: Exclude<OnboardingContextAction["type"], "RESET">
  onNext: () => void
  question: string
  subtitle?: string
}

const NAVIGATE_TO_NEXT_SCREEN_DELAY = 500

export const OnboardingQuestionTemplate: FC<OnboardingQuestionTemplateProps> = ({
  answers,
  action,
  onNext,
  question,
  subtitle,
}) => {
  const { goBack } = useNavigation()
  const { dispatch, next, onDone, state, progress } = useOnboardingContext()
  const [loading, setLoading] = useState(false)

  const stateKey = STATE_KEYS[action]
  const selected = (answer: string) =>
    typeof state[stateKey] === "object"
      ? state[stateKey]?.includes(answer)
      : state[stateKey] === answer

  const handleNext = () => {
    setLoading(true)
    next()
    setTimeout(() => {
      onNext()
      setLoading(false)
    }, NAVIGATE_TO_NEXT_SCREEN_DELAY)
  }

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
          <Join separator={<Spacer mt={2} />}>
            {answers.map((answer) => (
              <Pill
                key={`${answer}-pill`}
                rounded
                size="xs"
                Icon={loading && selected(answer) ? CheckCircleFillIcon : undefined}
                iconPosition="left"
                onPress={() => dispatch({ type: action, payload: answer })}
                selected={selected(answer)}
              >
                {answer}
              </Pill>
            ))}
          </Join>
        </Flex>
        <Flex>
          <Button block disabled={!state[stateKey]} onPress={handleNext}>
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
