// import { navigate } from "lib/navigation/navigate"
import { navigate } from "lib/navigation/navigate"
import { track as _track } from "lib/utils/track"
import { Button, Spacer } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation, View } from "react-native"

interface SaveAndContinueButtonProps {
  step: number
  totalSteps: number
  navigateToLink?: string
  setIsCompleted: Dispatch<SetStateAction<boolean>>
}

export const SaveAndContinueButton: React.FC<SaveAndContinueButtonProps> = ({
  step,
  totalSteps,
  navigateToLink = "",
  setIsCompleted,
}) => {
  const [isLastStep, setIsLastStep] = useState(false)

  useEffect(() => {
    setIsLastStep(step === totalSteps)
  }, [])
  return (
    <View>
      <Spacer mb={2} />
      <Button
        block
        haptic
        maxWidth={540}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          navigate(navigateToLink)
          setIsCompleted(true) // make checks here
        }}
      >
        {isLastStep ? "Submit Artwork" : "Save & Continue"}
      </Button>
    </View>
  )
}
