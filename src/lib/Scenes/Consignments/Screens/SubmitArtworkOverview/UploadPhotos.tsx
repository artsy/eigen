import { track as _track } from "lib/utils/track"
import React, { useEffect } from "react"
import { CollapsibleMenuItemProps } from "./ArtworkDetails"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const UploadPhotos = ({ activeStep, setActiveStep, step, totalSteps }: CollapsibleMenuItemProps) => {
  useEffect(() => {
    // console.log("\n\n ----------------------------- \n\n ")
  }, [activeStep])
  return (
    <CollapsibleMenuItem
      title="UploadPhotos"
      content="UploadPhotos content"
      step={step}
      totalSteps={totalSteps}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
    />
  )
}
