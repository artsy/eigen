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
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>ArtworkDetails Content</Text>
      <Text>ArtworkDetails Content</Text>
      <Text>ArtworkDetails Content</Text>
      <Text>ArtworkDetails Content</Text>
      <Text>ArtworkDetails Content</Text>
      <Text>ArtworkDetails Content</Text>
      <Text>ArtworkDetails Content</Text>
    </View>
  )
}
