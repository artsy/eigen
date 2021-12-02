import { track as _track } from "lib/utils/track"
import React from "react"
import { StepContent } from "./StepContent"

interface Props {
  setStep1Completed: any
}
export const ArtworkDetails: React.FC<Props> = ({ setStep1Completed }) => {
  // const checkIfFormIsCompleted = () => {
  //   // Check conditions
  //   // setIsFormComplete()
  // }

  return (
    <StepContent
      title="Artwork Details"
      content="lots of things to be added here..."
      setStepCompleted={setStep1Completed}
    />
  )
}
