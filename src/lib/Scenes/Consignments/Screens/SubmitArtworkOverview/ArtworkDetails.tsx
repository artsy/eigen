import { track as _track } from "lib/utils/track"
import React from "react"
import { Text, View } from "react-native"
export interface CollapsibleMenuItemProps {
  activeStep: number
  setActiveStep: any
  step: number
  totalSteps: number
}

export const ArtworkDetailsContent = () => {
  return (
    <View>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
      <Text>This is the ArtworkDetailsContent content...</Text>
    </View>
  )
}
