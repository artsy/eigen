import { useNavigation } from "@react-navigation/native"
import {
  OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
  OPTION_ARTISTS_ON_THE_RISE,
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_FOLLOW_ARTISTS_IM_INTERESTED_IN,
  OPTION_FOLLOW_GALLERIES_I_LOVE,
  OPTION_KEEP_TRACK_OF_ART,
  OPTION_TOP_AUCTION_LOTS,
} from "app/Scenes/Onboarding/OnboardingPersonalization2/config"
import { useMemo } from "react"
import { useNextOnboardingScreen } from "../Hooks/useNextOnboardingScreen"
import { useOnboardingContext } from "../Hooks/useOnboardingContext"
import { OnboardingQuestionTemplate } from "./OnboardingQuestionTemplate"

export const OnboardingQuestionThree = () => {
  const { navigate } = useNavigation()
  const { state } = useOnboardingContext()
  const nextScreen = useNextOnboardingScreen()

  const handleNext = () => {
    // @ts-expect-error
    navigate(nextScreen!)
  }

  const options = useMemo(() => {
    switch (true) {
      case state.questionTwo.length > 1:
        return [
          OPTION_FOLLOW_ARTISTS_IM_INTERESTED_IN,
          OPTION_TOP_AUCTION_LOTS,
          OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
          OPTION_ARTISTS_ON_THE_RISE,
        ]

      case state.questionTwo[0] === OPTION_DEVELOPING_MY_ART_TASTES:
        return [
          OPTION_TOP_AUCTION_LOTS,
          OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
          OPTION_ARTISTS_ON_THE_RISE,
        ]

      case state.questionTwo[0] === OPTION_KEEP_TRACK_OF_ART:
        return [OPTION_FOLLOW_ARTISTS_IM_INTERESTED_IN, OPTION_FOLLOW_GALLERIES_I_LOVE]

      case state.questionTwo[0] === OPTION_FINDING_GREAT_INVESTMENTS:
      case state.questionTwo[0] === OPTION_COLLECTING_ART_THAT_MOVES_ME:
        return [
          OPTION_FOLLOW_ARTISTS_IM_INTERESTED_IN,
          OPTION_TOP_AUCTION_LOTS,
          OPTION_ARTISTS_ON_THE_RISE,
        ]

      default:
        return []
    }
  }, [state.questionTwo])

  return (
    <OnboardingQuestionTemplate
      answers={options}
      action={ACTION}
      onNext={handleNext}
      question={QUESTION}
      subtitle={SUBTITLE}
    />
  )
}

const ACTION = "SET_ANSWER_THREE"
const QUESTION = "Almost done! What would you like to see first?"
const SUBTITLE = "Choose one to start exploring."
