import { Flex } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { GlobalStore } from "app/store/GlobalStore"
import { AnimatePresence, MotiView } from "moti"
import { useCallback } from "react"
import { ArtworkMontageStep } from "./Components/ArtworkMontageStep"
import { BrowsePromptStep } from "./Components/BrowsePromptStep"
import { Experience, QuestionStep } from "./Components/QuestionStep"
import { WelcomeStep } from "./Components/WelcomeStep"
import { NavigationStack } from "./Onboarding"
import {
  STEP_ARTWORK_MONTAGE,
  STEP_BROWSE_PROMPT,
  STEP_QUESTION,
  STEP_WELCOME,
  useConfig,
} from "./config"

export const Introduction: React.FC = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<NavigationStack>>()

  const handleDone = useCallback(
    (experience: Experience) => {
      if (experience === "beginner") {
        GlobalStore.actions.onboarding.setOnboardingDestination("infinite-discovery")
        GlobalStore.actions.onboarding.setOnboardingState("complete")
      } else {
        navigate("FollowArtists")
      }
    },
    [navigate]
  )

  const handleSkipToHome = useCallback(() => {
    GlobalStore.actions.onboarding.setOnboardingState("complete")
  }, [])

  const { currentStep, next, selectExperience } = useConfig({ onDone: handleDone })

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case STEP_QUESTION:
        return <QuestionStep onSelect={selectExperience} />
      case STEP_BROWSE_PROMPT:
        return <BrowsePromptStep onNext={next} onSkip={handleSkipToHome} />
      case STEP_ARTWORK_MONTAGE:
        return <ArtworkMontageStep onNext={next} />
      case STEP_WELCOME:
        return <WelcomeStep onNext={next} />
      default:
        return null
    }
  }, [currentStep, next, selectExperience, handleSkipToHome])

  return (
    <Flex flex={1} backgroundColor="background">
      <AnimatePresence>
        <MotiView
          key={currentStep}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {renderStep()}
        </MotiView>
      </AnimatePresence>
    </Flex>
  )
}
