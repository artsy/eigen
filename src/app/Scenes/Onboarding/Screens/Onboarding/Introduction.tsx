import { Flex } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { GlobalStore } from "app/store/GlobalStore"
import { WorkflowEngine } from "app/utils/WorkflowEngine/WorkflowEngine"
import { AnimatePresence, MotiView } from "moti"
import { useCallback, useRef, useState } from "react"
import { ArtworkMontageStep } from "./Components/ArtworkMontageStep"
import { BrowsePromptStep } from "./Components/BrowsePromptStep"
import { Experience, QuestionStep } from "./Components/QuestionStep"
import { WelcomeStep } from "./Components/WelcomeStep"
import { NavigationStack } from "./Onboarding"

const STEP_QUESTION = "question"
const STEP_BROWSE_PROMPT = "browse_prompt"
const STEP_ARTWORK_MONTAGE = "artwork_montage"
const STEP_WELCOME = "welcome"
const CHECK_EXPERIENCE = "check_experience"

export const Introduction: React.FC = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<NavigationStack>>()
  const experienceRef = useRef<Experience | null>(null)

  const workflowEngine = useRef(
    new WorkflowEngine({
      workflow: [
        STEP_QUESTION,
        {
          [CHECK_EXPERIENCE]: {
            beginner: [STEP_BROWSE_PROMPT, STEP_ARTWORK_MONTAGE, STEP_WELCOME],
            experienced: [STEP_ARTWORK_MONTAGE, STEP_WELCOME],
          },
        },
      ],
      conditions: {
        [CHECK_EXPERIENCE]: () => experienceRef.current ?? "experienced",
      },
    })
  )

  // `workflowEngine.current` is the value of the ref - a WorkflowEngine instance.
  // `workflowEngine.current.current()` is the current step of that WorkflowEngine instance.
  const [currentStep, setCurrentStep] = useState(workflowEngine.current.current())

  const handleDone = useCallback(() => {
    if (experienceRef.current === "beginner") {
      GlobalStore.actions.onboarding.setOnboardingDestination("infinite-discovery")
      GlobalStore.actions.onboarding.setOnboardingState("complete")
    } else {
      navigate("FollowArtists")
    }
  }, [navigate])

  const next = useCallback(() => {
    if (workflowEngine.current.isEnd()) {
      handleDone()
      return
    }
    const nextStep = workflowEngine.current.next()
    if (nextStep) setCurrentStep(nextStep)
  }, [handleDone])

  const handleSkipToHome = useCallback(() => {
    GlobalStore.actions.onboarding.setOnboardingState("complete")
  }, [])

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case STEP_QUESTION:
        return (
          <QuestionStep
            onSelect={(experience) => {
              experienceRef.current = experience
              next()
            }}
          />
        )
      case STEP_BROWSE_PROMPT:
        return <BrowsePromptStep onNext={next} onSkip={handleSkipToHome} />
      case STEP_ARTWORK_MONTAGE:
        return <ArtworkMontageStep onNext={next} />
      case STEP_WELCOME:
        return <WelcomeStep onNext={next} />
      default:
        return null
    }
  }, [currentStep, next, handleSkipToHome])

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
