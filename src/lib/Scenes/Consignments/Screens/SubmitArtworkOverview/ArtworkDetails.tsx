import { track as _track } from "lib/utils/track"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { useState } from "react"
import { Text, View } from "react-native"
import { ComponentWithCollapsibleMenuItemProps } from "./types"

export const ArtworkDetailsContent = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>ArtworkDetails Content</Text>
      <Text>Form</Text>
    </View>
  )
}

export const ArtworkDetails: React.FC<ComponentWithCollapsibleMenuItemProps> = ({
  activeStep,
  setActiveStep,
  totalSteps,
  step,
  setStepsCompleted,
  stepsCompleted,
}) => {
  const [isCompleted, setIsCompleted] = useState(false)
  return (
    <CollapsibleMenuItem
      title="Artwork Details"
      activeStep={activeStep}
      step={step}
      setActiveStep={setActiveStep}
      isCompleted={isCompleted}
      setIsCompleted={setIsCompleted}
      Content={() => <ArtworkDetailsContent />}
      totalSteps={totalSteps}
      setStepsCompleted={setStepsCompleted}
      stepsCompleted={stepsCompleted}
    />
  )
}
