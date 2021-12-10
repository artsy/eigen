import { Dispatch, SetStateAction } from "react"

export interface ComponentWithCollapsibleMenuItemProps {
  title: string
  isCompleted?: boolean
  step: number
  totalSteps: number
  activeStep: number
  setActiveStep: Dispatch<SetStateAction<number>>
  hasSaveButton?: boolean
  navigateToLink?: string
  setStepsCompleted: Dispatch<SetStateAction<number[]>>
  stepsCompleted: number[]
}
