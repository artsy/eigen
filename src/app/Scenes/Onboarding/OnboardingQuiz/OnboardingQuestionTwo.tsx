import { useNavigation } from "@react-navigation/native"
import { useOnboardingContext } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingContext"
import { useOnboardingTracking } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingTracking"
import {
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_KEEP_TRACK_OF_ART,
} from "app/Scenes/Onboarding/OnboardingQuiz/config"
import { useCallback } from "react"
import { OnboardingQuestionTemplate } from "./Components/OnboardingQuestionTemplate"

export const OnboardingQuestionTwo = () => {
  const {
    state: { questionTwo },
  } = useOnboardingContext()
  const { trackAnsweredQuestionTwo } = useOnboardingTracking()
  const { navigate } = useNavigation()

  const handleNext = useCallback(() => {
    if (questionTwo) {
      trackAnsweredQuestionTwo(questionTwo)
    }
    // @ts-expect-error
    navigate("OnboardingQuestionThree")
  }, [navigate, questionTwo, trackAnsweredQuestionTwo])

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
