import { useNavigation } from "@react-navigation/native"
import {
  OPTION_NO_IM_JUST_STARTING_OUT,
  OPTION_YES_I_LOVE_COLLECTING_ART,
} from "app/Scenes/Onboarding/OnboardingPersonalization2/config"
import { useOnboardingContext } from "../Hooks/useOnboardingContext"
import { useUpdateUserProfile } from "../Hooks/useUpdateUserProfile"
import { OnboardingQuestionTemplate } from "./OnboardingQuestionTemplate"

type QuestionOneAnswerType =
  | typeof OPTION_NO_IM_JUST_STARTING_OUT
  | typeof OPTION_YES_I_LOVE_COLLECTING_ART

export const OnboardingQuestionOne = () => {
  const { state } = useOnboardingContext()
  const { navigate } = useNavigation()

  // @ts-expect-error
  const navigateToNextScreen = () => navigate("OnboardingQuestionTwo")

  const { commitMutation } = useUpdateUserProfile(navigateToNextScreen)

  const handleNext = async () => {
    const level = COLLECTOR_LEVELS[state.questionOne as QuestionOneAnswerType]

    commitMutation({
      collectorLevel: level,
    })
  }

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
const QUESTION = "Have you ever purchased art before?"

const COLLECTOR_LEVELS = {
  [OPTION_YES_I_LOVE_COLLECTING_ART]: 3,
  [OPTION_NO_IM_JUST_STARTING_OUT]: 2,
}
