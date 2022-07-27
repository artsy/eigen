import { useNavigation } from "@react-navigation/native"
import {
  Action,
  useOnboardingContext,
} from "app/Scenes/Onboarding/OnboardingPersonalization2/Hooks/useOnboardingContext"
import {
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
import { FC } from "react"
import { StatusBar } from "react-native"

interface OnboardingQuestionTemplateProps {
  answers: string[]
  action: Exclude<Action["type"], "RESET">
  onNext: () => void
  progress: number
  question: string
  subtitle?: string
}

export const OnboardingQuestionTemplate: FC<OnboardingQuestionTemplateProps> = ({
  answers,
  action,
  onNext,
  progress,
  question,
  subtitle,
}) => {
  const { goBack } = useNavigation()
  const { dispatch, next, onDone, state } = useOnboardingContext()
  const stateKey = KEYS[action] as keyof typeof state
  const selected = (answer: string) =>
    typeof state[stateKey] === "object"
      ? state[stateKey]?.includes(answer)
      : state[stateKey] === answer

  const handleNext = () => {
    next()
    onNext()
  }

  return (
    <Screen>
      <Screen.Body>
        <StatusBar />
        <Screen.Header onBack={goBack} onSkip={onDone} />
        <Flex flex={1} flexDirection="column" padding={2}>
          <ProgressBar progress={progress} />
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
                Icon={selected(answer) ? CheckCircleFillIcon : undefined}
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
          <Button block disabled={!state.questionOne} onPress={handleNext}>
            Next
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const KEYS = {
  SET_ANSWER_ONE: "questionOne",
  SET_ANSWER_TWO: "questionTwo",
  SET_ANSWER_THREE: "questionThree",
  FOLLOW: "followedIds",
}
