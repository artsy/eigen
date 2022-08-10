import { useNavigation } from "@react-navigation/native"
import {
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_KEEP_TRACK_OF_ART,
} from "app/Scenes/Onboarding/OnboardingV2/config"
import { useCallback } from "react"
import { OnboardingQuestionTemplate } from "./Components/OnboardingQuestionTemplate"

export const OnboardingQuestionTwo = () => {
  const { navigate } = useNavigation()

  const handleNext = useCallback(() => {
    // @ts-expect-error
    navigate("OnboardingQuestionThree")
  }, [navigate])

  return (
    <OnboardingQuestionTemplate
      answers={ANSWERS}
      action={ACTION}
      onNext={handleNext}
      question={QUESTION}
      subtitle={SUBTITLE}
    />
  )
}

const ACTION = "SET_ANSWER_TWO"
const ANSWERS = [
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_KEEP_TRACK_OF_ART,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
]
const QUESTION = "What do you love most about art?"
const SUBTITLE = "Choose as many as you like."
