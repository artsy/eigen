import { track as _track } from "lib/utils/track"
import React from "react"
import { ScrollView, Text, View } from "react-native"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export interface CollapsibleMenuItemProps {
  activeStep: number
  setActiveStep: any
  step: number
  totalSteps: number
}

const ArtworkDetailsContent = () => {
  return (
    <View>
      <Text>This is the ArtworkDetailsContent content...</Text>
    </View>
  )
}
export const ArtworkDetails: React.FC<CollapsibleMenuItemProps> = ({ activeStep, setActiveStep, step, totalSteps }) => {
  return (
    <CollapsibleMenuItem
      title="Artwork Details"
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      content={<ArtworkDetailsContent />}
      step={step}
      totalSteps={totalSteps}
    />
  )
}
