import { track as _track } from "lib/utils/track"
import { Text } from "palette"
import React, { Dispatch, SetStateAction } from "react"
import { View } from "react-native"
import { SaveAndContinueButton } from "./SaveAndContinueButton"

interface ContentProps {
  activeStep: number
  totalSteps: number
  navigateToLink?: string
  setIsCompleted: Dispatch<SetStateAction<boolean>>
}
export const Content: React.FC<ContentProps> = ({ activeStep, totalSteps, navigateToLink, setIsCompleted }) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>This is the collapsible menu content</Text>
      <SaveAndContinueButton
        step={activeStep}
        totalSteps={totalSteps}
        setIsCompleted={setIsCompleted}
        navigateToLink={navigateToLink}
      />
    </View>
  )
}
