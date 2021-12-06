import { navigate } from "lib/navigation/navigate"
import { track as _track } from "lib/utils/track"
import { Button, Flex, Sans, Spacer } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, Separator } from "palette"
import React, { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

interface Props {
  title: string
  Content: string | React.FC | any
  isCompleted?: boolean
  step: number
  totalSteps: number
  activeStep: number
  setActiveStep: any
}

export const CollapsibleMenuItem: React.FC<Props> = ({
  title = "Title",
  Content = "Content",
  step,
  totalSteps,
  isCompleted,
  activeStep,
  setActiveStep,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [isLastStep, setLastStep] = useState(false)

  useEffect(() => {
    setIsContentVisible(activeStep === step)
  }, [activeStep])

  useEffect(() => {
    setLastStep(step === totalSteps)
  }, [isLastStep])

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setIsContentVisible(!isContentVisible)
      }}
    >
      <View>
        <Sans size="1">
          Step {step} of {totalSteps}
        </Sans>
        <View style={styles.titleAndIcon}>
          <Sans size="8">{title}</Sans>
          <View style={styles.icons}>
            {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={styles.circle} />}
            {!!isContentVisible ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>
        </View>
      </View>
      {!!isContentVisible && (
        <>
          <Content />
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
                    navigate(`/artwork-submitted`)
                  }
                }}
              >
                Save & Continue
              </Button>
            </Flex>
          </View>
        </>
      )}
      <Separator marginTop="40" marginBottom="20" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { paddingLeft: 20, paddingRight: 20 },
  titleAndIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
  },
  icons: { flexDirection: "row", alignItems: "center" },
  circle: { marginRight: 5 },
})
