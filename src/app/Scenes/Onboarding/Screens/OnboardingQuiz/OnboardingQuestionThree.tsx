import { useNavigation } from "@react-navigation/native"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import {
  OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
  OPTION_ARTISTS_ON_THE_RISE,
  OPTION_COLLECTING_ART_THAT_MOVES_ME,
  OPTION_DEVELOPING_MY_ART_TASTES,
  OPTION_FINDING_GREAT_INVESTMENTS,
  OPTION_FOLLOW_ARTISTS_I_WANT_TO_COLLECT,
  OPTION_FOLLOW_GALLERIES_IM_INTERESTED_IN,
  OPTION_KEEP_TRACK_OF_ART,
  OPTION_TOP_AUCTION_LOTS,
  OPTION_THE_ART_TASTE_QUIZ,
  OPTION_HUNTING_FOR_ART_WITHIN_BUDGET,
} from "app/Scenes/Onboarding/Screens/OnboardingQuiz/config"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback, useMemo } from "react"
import { OnboardingQuestionTemplate } from "./Components/OnboardingQuestionTemplate"
import { useNextOnboardingScreen } from "./Hooks/useNextOnboardingScreen"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

export const OnboardingQuestionThree = () => {
  const { trackAnsweredQuestionThree } = useOnboardingTracking()
  const { navigate } = useNavigation()
  const {
    state: { questionTwo, questionThree },
    onDone,
  } = useOnboardingContext()
  const nextScreen = useNextOnboardingScreen()

  const handleNext = useCallback(() => {
    if (!!questionThree) {
      trackAnsweredQuestionThree(questionThree)
    }
    if (questionThree === OPTION_THE_ART_TASTE_QUIZ) {
      GlobalStore.actions.onboarding.setArtQuizState("incomplete")
      onDone()
    } else {
      // @ts-expect-error
      navigate(nextScreen)
    }
  }, [navigate, nextScreen, questionThree, trackAnsweredQuestionThree, onDone])

  const options = useMemo(() => {
    switch (true) {
      case questionTwo.length > 2 &&
        questionTwo.includes(OPTION_DEVELOPING_MY_ART_TASTES) &&
        questionTwo.includes(OPTION_COLLECTING_ART_THAT_MOVES_ME) &&
        questionTwo.includes(OPTION_FINDING_GREAT_INVESTMENTS):
      case questionTwo.length > 1 &&
        questionTwo.includes(OPTION_DEVELOPING_MY_ART_TASTES) &&
        questionTwo.includes(OPTION_FINDING_GREAT_INVESTMENTS):
      case questionTwo.length > 1 &&
        questionTwo.includes(OPTION_COLLECTING_ART_THAT_MOVES_ME) &&
        questionTwo.includes(OPTION_FINDING_GREAT_INVESTMENTS):
      case questionTwo.length > 1 &&
        questionTwo.includes(OPTION_DEVELOPING_MY_ART_TASTES) &&
        questionTwo.includes(OPTION_COLLECTING_ART_THAT_MOVES_ME):
        return [
          OPTION_THE_ART_TASTE_QUIZ,
          OPTION_TOP_AUCTION_LOTS,
          OPTION_ARTISTS_ON_THE_RISE,
          OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
        ]

      case questionTwo.length > 1:
        return [
          OPTION_FOLLOW_ARTISTS_I_WANT_TO_COLLECT,
          OPTION_TOP_AUCTION_LOTS,
          OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
          OPTION_ARTISTS_ON_THE_RISE,
        ]

      case questionTwo[0] === OPTION_DEVELOPING_MY_ART_TASTES:
        return [
          OPTION_THE_ART_TASTE_QUIZ,
          OPTION_TOP_AUCTION_LOTS,
          OPTION_A_CURATED_SELECTION_OF_ARTWORKS,
          OPTION_ARTISTS_ON_THE_RISE,
        ]

      case questionTwo[0] === OPTION_KEEP_TRACK_OF_ART:
        return [OPTION_FOLLOW_ARTISTS_I_WANT_TO_COLLECT, OPTION_FOLLOW_GALLERIES_IM_INTERESTED_IN]

      case questionTwo[0] === OPTION_FINDING_GREAT_INVESTMENTS:
      case questionTwo[0] === OPTION_HUNTING_FOR_ART_WITHIN_BUDGET:
      case questionTwo[0] === OPTION_COLLECTING_ART_THAT_MOVES_ME:
        return [
          OPTION_THE_ART_TASTE_QUIZ,
          OPTION_FOLLOW_ARTISTS_I_WANT_TO_COLLECT,
          OPTION_TOP_AUCTION_LOTS,
          OPTION_ARTISTS_ON_THE_RISE,
        ]

      default:
        return []
    }
  }, [questionTwo])

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
const QUESTION = "Almost done! Now select some artworks and artists to tailor Artsy to your tastes."
const SUBTITLE = "Choose one to start exploring."
