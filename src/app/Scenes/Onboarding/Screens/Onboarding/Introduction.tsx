import { Flex } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { WelcomeStepQuery } from "__generated__/WelcomeStepQuery.graphql"
import { useOnboardingTracking } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Hooks/useOnboardingTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { AnimatePresence, MotiView } from "moti"
import { useCallback, useEffect } from "react"
import { useQueryLoader } from "react-relay"
import { ArtworkMontageStep } from "./Components/ArtworkMontageStep"
import { BrowsePromptStep } from "./Components/BrowsePromptStep"
import { Experience, QuestionStep } from "./Components/QuestionStep"
import { WelcomeStep, WelcomeStepScreenQuery } from "./Components/WelcomeStep"
import { NavigationStack } from "./Onboarding"
import {
  STEP_ARTWORK_MONTAGE,
  STEP_BROWSE_PROMPT,
  STEP_QUESTION,
  STEP_WELCOME,
  useConfig,
} from "./config"

export const Introduction: React.FC = () => {
  const { replace } = useNavigation<NativeStackNavigationProp<NavigationStack>>()
  const [welcomeQueryRef, loadWelcomeQuery] =
    useQueryLoader<WelcomeStepQuery>(WelcomeStepScreenQuery)
  const { trackStartedOnboarding, trackCompletedOnboarding, trackAnsweredExperienceQuestion } =
    useOnboardingTracking()

  useEffect(() => {
    loadWelcomeQuery({}, { fetchPolicy: "network-only" })
  }, [loadWelcomeQuery])

  useEffect(() => {
    trackStartedOnboarding()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDone = useCallback(
    (experience: Experience) => {
      if (experience === "beginner") {
        replace("InfiniteDiscovery")
      } else {
        replace("FollowArtists")
      }
    },
    [replace]
  )

  const handleSkipToHome = useCallback(() => {
    trackCompletedOnboarding()
    GlobalStore.actions.onboarding.setOnboardingState("complete")
  }, [trackCompletedOnboarding])

  const { currentStep, next, selectExperience } = useConfig({ onDone: handleDone })

  const handleSelectExperience = (experience: Experience) => {
    trackAnsweredExperienceQuestion(experience)
    selectExperience(experience)
  }

  const renderStep = () => {
    switch (currentStep) {
      case STEP_QUESTION:
        return <QuestionStep onSelect={handleSelectExperience} />
      case STEP_BROWSE_PROMPT:
        return <BrowsePromptStep onNext={next} onSkip={handleSkipToHome} />
      case STEP_ARTWORK_MONTAGE:
        return <ArtworkMontageStep onNext={next} />
      case STEP_WELCOME:
        return welcomeQueryRef ? <WelcomeStep onNext={next} queryRef={welcomeQueryRef} /> : null
      default:
        return null
    }
  }

  return (
    <Flex flex={1} backgroundColor="mono100">
      <AnimatePresence>
        <MotiView
          key={currentStep}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300 }}
          exitTransition={{ type: "timing", duration: 300 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {renderStep()}
        </MotiView>
      </AnimatePresence>
    </Flex>
  )
}
