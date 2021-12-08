import { navigate } from "lib/navigation/navigate"
import { track as _track } from "lib/utils/track"
import { Button, Flex, Spacer } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation, View } from "react-native"

interface SaveButtonProps {
  step: number
  totalSteps: number
  setActiveStep: any
  hasSaveButton?: boolean
  setIsContentVisible: Dispatch<SetStateAction<boolean>>
  navigateToLink?: string
}

export const SaveAndContinueButton: React.FC<SaveButtonProps> = ({
  step,
  totalSteps,
  setIsContentVisible,
  setActiveStep,
  navigateToLink,
}) => {
  const [isLastStep, setLastStep] = useState(false)

  useEffect(() => {
    setLastStep(step === totalSteps)
  }, [isLastStep])
  return (
    <View>
      <Spacer mb={2} />
      <Flex px="2" width="100%" alignItems="center">
        <Button
          block
          haptic
          maxWidth={540}
          onPress={() => {
            setIsContentVisible(false)
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setActiveStep(step + 1)
            if (isLastStep && navigateToLink) {
              navigate(navigateToLink)
            }
          }}
        >
          {isLastStep ? "Submit Artwork" : "Save & Continue"}
        </Button>
      </Flex>
    </View>
  )
}
