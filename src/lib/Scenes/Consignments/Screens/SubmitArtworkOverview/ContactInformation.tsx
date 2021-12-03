import { track as _track } from "lib/utils/track"
import React from "react"
import { CollapsibleMenuItemProps } from "./ArtworkDetails"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const ContactInformation = ({ activeStep, setActiveStep, step, totalSteps }: CollapsibleMenuItemProps) => {
  return (
    <CollapsibleMenuItem
      title="Contact information"
      content="Contact information content"
      step={step}
      totalSteps={totalSteps}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
    />
  )
}
