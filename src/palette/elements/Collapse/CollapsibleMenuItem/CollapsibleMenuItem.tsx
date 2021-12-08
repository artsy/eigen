import { track as _track } from "lib/utils/track"
import { Sans } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from "react-native"
import { SaveAndContinueButton } from "./SaveAndContinueButton"

interface Props {
  title: string
  Content: React.FC
  isCompleted?: boolean
  step: number
  totalSteps: number
  activeStep: number
  setActiveStep: Dispatch<SetStateAction<boolean>>
  hasSaveButton?: boolean
  navigateToLink?: string
}

export const CollapsibleMenuItem: React.FC<Props> = ({
  title = "Title",
  Content = "Content",
  step,
  totalSteps,
  isCompleted,
  activeStep,
  setActiveStep,
  hasSaveButton = true,
  navigateToLink,
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
    <View style={styles.container}>
      <View>
        <Sans size="1">
          Step {step} of {totalSteps}
        </Sans>
        <TouchableOpacity
          style={styles.titleAndIcon}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setIsContentVisible(!isContentVisible)
          }}
        >
          <Sans size="8">{title}</Sans>
          <View style={styles.icons}>
            {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={styles.circle} />}
            {!!isContentVisible ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>
        </TouchableOpacity>
      </View>
      {!!isContentVisible && (
        <>
          <Content />
          {!!hasSaveButton && (
            <SaveAndContinueButton
              setIsContentVisible={setIsContentVisible}
              setActiveStep={setActiveStep}
              step={step}
              totalSteps={totalSteps}
              navigateToLink={navigateToLink}
            />
          )}
        </>
      )}
    </View>
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
