import { track as _track } from "lib/utils/track"
import { Button, Flex, Spacer } from "palette"
import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"

interface Props {
  setIsContentVisible?: string | React.FC | any
  step: number
  totalSteps: number
  setActiveStep: any
  activeStep: number
}
export const SaveAndContinue: React.FC<Props> = ({
  setIsContentVisible,
  step,
  totalSteps,
  setActiveStep,
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
            setActiveStep(step + 1)
            if (isLastStep) {
              console.log("Navigate to success page")
            }
          }}
        >
          Save & Continue
        </Button>
        {!!isLastStep && <Text>last step, about to navigate away...</Text>}
      </Flex>
    </View>
  )
}
