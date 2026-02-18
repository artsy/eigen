import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useOnboardingContext } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingContext"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/OnboardingQuiz"
import {
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_HUNTING_FOR_ART_WITHIN_BUDGET,
  OPTION_KEEP_TRACK_OF_ART,
} from "app/Scenes/Onboarding/Screens/OnboardingQuiz/config"
import { useCallback } from "react"
import { OnboardingQuestionTemplate } from "./Components/OnboardingQuestionTemplate"
import { shouldShowPriceRange } from "./utils/shouldShowPriceRange"

export const OnboardingQuestionTwo = () => {
  const {
    state: { questionTwo },
    next,
  } = useOnboardingContext()
  const { trackAnsweredQuestionTwo } = useOnboardingTracking()
  const { navigate } = useNavigation<NavigationProp<OnboardingNavigationStack>>()

  const handleNext = useCallback(() => {
    if (questionTwo) {
      trackAnsweredQuestionTwo(questionTwo)
    }

    // Check if we should navigate to the price range screen
    const showPriceRange = shouldShowPriceRange(questionTwo)

    // Update the workflow state
    next()

    // Navigate based on our condition check
    if (showPriceRange) {
      navigate("OnboardingPriceRange")
    } else {
      navigate("OnboardingQuestionThree")
    }
  }, [next, navigate, questionTwo, trackAnsweredQuestionTwo])

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
  OPTION_HUNTING_FOR_ART_WITHIN_BUDGET,
]
const QUESTION = "What do you love most about art?"
const SUBTITLE = "Choose as many as you like."
