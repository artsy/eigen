import { useNavigation } from "@react-navigation/native"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import {
  OPTION_NO_IM_JUST_STARTING_OUT,
  OPTION_YES_I_LOVE_COLLECTING_ART,
} from "app/Scenes/Onboarding/Screens/OnboardingQuiz/config"
import { useCallback } from "react"
import { OnboardingQuestionTemplate } from "./Components/OnboardingQuestionTemplate"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"
import { useUpdateUserProfile } from "./Hooks/useUpdateUserProfile"

type QuestionOneAnswerType =
  | typeof OPTION_NO_IM_JUST_STARTING_OUT
  | typeof OPTION_YES_I_LOVE_COLLECTING_ART

export const OnboardingQuestionOne = () => {
  const {
    state: { questionOne },
  } = useOnboardingContext()
  const { trackAnsweredQuestionOne } = useOnboardingTracking()
  const { navigate } = useNavigation()

  // @ts-expect-error
  const navigateToNextScreen = () => navigate("OnboardingQuestionTwo")

  const { commitMutation } = useUpdateUserProfile(navigateToNextScreen)

  const handleNext = useCallback(async () => {
    const level = COLLECTOR_LEVELS[questionOne as QuestionOneAnswerType]

    commitMutation({
      collectorLevel: level,
    })
    if (questionOne) {
      trackAnsweredQuestionOne(questionOne)
    }
  }, [commitMutation, questionOne, trackAnsweredQuestionOne])

  return (
    <OnboardingQuestionTemplate
      answers={ANSWERS}
      action={ACTION}
      onNext={handleNext}
      question={QUESTION}
    />
  )
}

const ACTION = "SET_ANSWER_ONE"
const ANSWERS = [OPTION_YES_I_LOVE_COLLECTING_ART, OPTION_NO_IM_JUST_STARTING_OUT]
const QUESTION = "Have you purchased art before?"

const COLLECTOR_LEVELS = {
  [OPTION_YES_I_LOVE_COLLECTING_ART]: 3,
  [OPTION_NO_IM_JUST_STARTING_OUT]: 2,
}
