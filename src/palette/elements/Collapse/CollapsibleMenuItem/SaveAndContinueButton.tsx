import { navigate } from "lib/navigation/navigate"
import { track as _track } from "lib/utils/track"
import { Button } from "palette"
import React, { Dispatch, SetStateAction } from "react"
import { LayoutAnimation, View } from "react-native"

interface SaveAndContinueButtonProps {
  navigateToLink?: string
  setIsCompleted: Dispatch<SetStateAction<boolean>>
  isLastStep: boolean
  textToRender: string
}

export const SaveAndContinueButton: React.FC<SaveAndContinueButtonProps> = ({
  navigateToLink = "",
  setIsCompleted,
  isLastStep,
  textToRender,
}) => {
  return (
    <View>
      <Button
        block
        haptic
        maxWidth={540}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          if (isLastStep) {
            navigate(navigateToLink)
          }
          setIsCompleted(true) // make checks here
        }}
      >
        {textToRender}
      </Button>
    </View>
  )
}
