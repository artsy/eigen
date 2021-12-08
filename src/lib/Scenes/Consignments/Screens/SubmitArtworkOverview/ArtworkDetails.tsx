import { track as _track } from "lib/utils/track"
import React, { Dispatch, SetStateAction } from "react"
import { Text, View } from "react-native"

export interface CollapsibleMenuItemProps {
  activeStep: number
  setActiveStep: Dispatch<SetStateAction<boolean>>
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
