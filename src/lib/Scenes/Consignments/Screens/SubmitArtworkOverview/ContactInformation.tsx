import { track as _track } from "lib/utils/track"
import React from "react"
import { View } from "react-native"
import { CollapsibleMenuItemProps } from "./ArtworkDetails"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const ContactInformation = ({ activeStep, setActiveStep, step, totalSteps }: CollapsibleMenuItemProps) => {
  return (
    <View>
      <CollapsibleMenuItem
        title="Contact information"
        content="Contact information content"
        step={step}
        totalSteps={totalSteps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
    </View>
  )
}
