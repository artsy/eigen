// import { navigate } from "lib/navigation/navigate"
import { track as _track } from "lib/utils/track"
import { Button, Spacer } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation, View } from "react-native"

interface SaveButtonProps {
  step: number
  totalSteps: number
  enabledSteps: number[]
  hasSaveButton?: boolean
  setActiveStep: Dispatch<SetStateAction<number>>
  setEnabledSteps: Dispatch<SetStateAction<number[]>>
  setIsCompleted: Dispatch<SetStateAction<boolean>>
  navigateToLink?: string
}

export const SaveAndContinueButton: React.FC<SaveButtonProps> = ({
  step,
  totalSteps,
  setActiveStep,
  enabledSteps,
  setEnabledSteps,
  setIsCompleted,
  // navigateToLink,
}) => {
  const [isLastStep, setLastStep] = useState(false)

  useEffect(() => {
    setLastStep(step === totalSteps)
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
          // TS is complaining here, WHY?
          // navigate(navigateToLink)
          setIsCompleted(true) // make checks here
          setActiveStep(step + 1)
          setEnabledSteps([...enabledSteps, step + 1])
        }}
      >
        {isLastStep ? "Submit Artwork" : "Save & Continue"}
      </Button>
    </View>
  )
}
