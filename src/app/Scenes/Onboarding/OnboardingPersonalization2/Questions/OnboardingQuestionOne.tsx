import { useNavigation } from "@react-navigation/native"
import {
  OPTION_NO_IM_JUST_STARTING_OUT,
  OPTION_YES_I_LOVE_COLLECTING_ART,
} from "app/Scenes/Onboarding/OnboardingPersonalization2/config"
import { OnboardingQuestionTemplate } from "./OnboardingQuestionTemplate"

export const OnboardingQuestionOne = () => {
  const { navigate } = useNavigation()
  const handleNext = () => {
    navigate("OnboardingQuestionTwo")
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
