import { Color } from "@artsy/palette-mobile"
import { ALWAYS_BLACK } from "app/utils/colors"
import { useCallback, useRef, useState } from "react"
import { Experience } from "./Components/QuestionStep"

export const STEP_ARTWORK_MONTAGE = "artwork_montage"
export const STEP_WELCOME = "welcome"
export const STEP_QUESTION = "question"
export const STEP_BROWSE_PROMPT = "browse_prompt"

const STEPS = [STEP_ARTWORK_MONTAGE, STEP_WELCOME, STEP_QUESTION, STEP_BROWSE_PROMPT] as const

export type OnboardingStep = (typeof STEPS)[number]

export const STEP_BACKDROPS: Record<OnboardingStep, Color> = {
  [STEP_ARTWORK_MONTAGE]: ALWAYS_BLACK,
  [STEP_WELCOME]: ALWAYS_BLACK,
  [STEP_QUESTION]: ALWAYS_BLACK,
  [STEP_BROWSE_PROMPT]: "mono0",
}

interface UseConfigProps {
  onDone: (experience: Experience) => void
}

export const useConfig = ({ onDone }: UseConfigProps) => {
  const experienceRef = useRef<Experience | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = STEPS[stepIndex]

  const next = useCallback(() => {
    if (stepIndex >= STEPS.length - 1) {
      onDone(experienceRef.current ?? "experienced")
      return
    }
    setStepIndex((i) => i + 1)
  }, [stepIndex, onDone])

  const selectExperience = useCallback(
    (experience: Experience) => {
      experienceRef.current = experience
      if (experience === "experienced") {
        onDone(experience)
      } else {
        next()
      }
    },
    [next, onDone]
  )

  return { currentStep, next, selectExperience }
}
