import { useNavigation } from "@react-navigation/native"
import {
  OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
  OPTION_ARTISTS_ON_THE_RISE,
  OPTION_MY_FAVORITE_ARTISTS,
  OPTION_TOP_AUCTION_LOTS,
} from "app/Scenes/Onboarding/OnboardingPersonalization2/config"
import { OnboardingQuestionTemplate } from "./OnboardingQuestionTemplate"

export const OnboardingQuestionThree = () => {
  const { navigate } = useNavigation()
  const handleNext = () => {
    // TODO: navigate to next question
    navigate("OnboardingQuestionOne")
  }

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

const ACTION = "SET_ANSWER_THREE"
const ANSWERS = [
  OPTION_ARTISTS_ON_THE_RISE,
  OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
  OPTION_TOP_AUCTION_LOTS,
  OPTION_MY_FAVORITE_ARTISTS,
]
const QUESTION = "Almost done! What would you like to see first?"
const SUBTITLE = "Choose one to start exploring."
