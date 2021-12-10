import { navigate } from "lib/navigation/navigate"
import { track as _track } from "lib/utils/track"
import { Button, Spacer } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation, View } from "react-native"

interface SaveButtonProps {
  step: number
  totalSteps: number
  setActiveStep: any
  hasSaveButton?: boolean
  setIsContentVisible: Dispatch<SetStateAction<boolean>>
  setIsCompleted: Dispatch<SetStateAction<boolean>>
  navigateToLink?: string
  setStepsCompleted: Dispatch<SetStateAction<number[]>>
  stepsCompleted: [number]
}

export const SaveAndContinueButton: React.FC<SaveButtonProps> = ({
  step,
  totalSteps,
  setIsContentVisible,
  setActiveStep,
  navigateToLink,
  setIsCompleted,
  setStepsCompleted,
  stepsCompleted,
}) => {
  const [isLastStep, setLastStep] = useState(false)

  useEffect(() => {
    setLastStep(step === totalSteps)
  }, [isLastStep])
  return (
    <View>
      <Spacer mb={2} />
      <Button
        block
        haptic
        maxWidth={540}
        onPress={() => {
          setIsContentVisible(false)
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          if (isLastStep && navigateToLink) {
            navigate(navigateToLink)
          }
          setIsCompleted(true) // make checks here
          setActiveStep(step + 1)
          setStepsCompleted([...stepsCompleted, step])
        }}
      >
        {isLastStep ? "Submit Artwork" : "Save & Continue"}
      </Button>
    </View>
  )
}
