import { WorkflowEngine } from "app/utils/WorkflowEngine/WorkflowEngine"
import { useCallback, useRef, useState } from "react"
import { Experience } from "./Components/QuestionStep"

export const STEP_QUESTION = "question"
export const STEP_BROWSE_PROMPT = "browse_prompt"
export const STEP_ARTWORK_MONTAGE = "artwork_montage"
export const STEP_WELCOME = "welcome"

const CHECK_EXPERIENCE = "check_experience"

interface UseConfigProps {
  onDone: (experience: Experience) => void
}

export const useConfig = ({ onDone }: UseConfigProps) => {
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

  const [currentStep, setCurrentStep] = useState(workflowEngine.current.current())

  const next = useCallback(() => {
    if (workflowEngine.current.isEnd()) {
      onDone(experienceRef.current ?? "experienced")
      return
    }
    const nextStep = workflowEngine.current.next()
    if (nextStep) setCurrentStep(nextStep)
  }, [onDone])

  const selectExperience = useCallback(
    (experience: Experience) => {
      experienceRef.current = experience
      next()
    },
    [next]
  )

  return { currentStep, next, selectExperience }
}
