import { Button } from "palette"
import React, { Dispatch, SetStateAction } from "react"
import { LayoutAnimation, View } from "react-native"

interface SaveAndContinueButtonProps {
  setIsCompleted: Dispatch<SetStateAction<boolean>>
  buttonText: string
  handleClick: () => void
}

export const SaveAndContinueButton: React.FC<SaveAndContinueButtonProps> = ({
  setIsCompleted,
  buttonText,
  handleClick,
}) => {
  return (
    <View>
      <Button
        block
        haptic
        maxWidth={540}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          handleClick()
          // Check if the forms are correctly completed here.
          // If they are, continue to set setIsCompleted(true)
          // if not display an error message "information on field ___ is missing"
          setIsCompleted(true)
        }}
      >
        {buttonText}
      </Button>
    </View>
  )
}
