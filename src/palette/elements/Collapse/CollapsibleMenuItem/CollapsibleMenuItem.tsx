import { track as _track } from "lib/utils/track"
import { Sans } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from "react-native"
import { Content } from "./Content"

interface CollapsibleMenuItemProps {
  stepNumber: number
  totalSteps: number
  title: string
  activeStep: number
  enabledSteps: number[]
  enabled: boolean
  setActiveStep: Dispatch<SetStateAction<number>>
  setEnabledSteps: Dispatch<SetStateAction<number[]>>
  navigateToLink?: string
}
// user must complete one step before being able to go to another. This is why we have "enabled" state
export const CollapsibleMenuItem: React.FC<CollapsibleMenuItemProps> = ({
  enabled,
  title,
  stepNumber,
  totalSteps,
  activeStep,
  setActiveStep,
  enabledSteps,
  setEnabledSteps,
  navigateToLink,
}) => {
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (isCompleted) {
      setActiveStep(activeStep + 1)
      setEnabledSteps([...enabledSteps, activeStep + 1])
    }
  }, [isCompleted])

  return (
    <>
      {enabled ? ( //  CLICKABLE
        <View style={styles.container}>
          <Sans size="1">
            Step {stepNumber} of {totalSteps}
          </Sans>
          <TouchableOpacity
            style={styles.titleAndIcon}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
              setActiveStep(stepNumber)
            }}
          >
            <Sans size="8">{title}</Sans>
            <View style={styles.icons}>
              {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={styles.circle} />}
              {activeStep === stepNumber ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </View>
          </TouchableOpacity>
          {activeStep === stepNumber && (
            <Content // TODO: this should be passed as a prop
              activeStep={activeStep}
              totalSteps={totalSteps}
              navigateToLink={navigateToLink}
              setIsCompleted={setIsCompleted}
            />
          )}
        </View>
      ) : (
        // NOT CLICKABLE
        <View style={styles.container}>
          <Sans size="1" color="black30">
            Step {stepNumber} of {totalSteps}
          </Sans>
          <View style={styles.titleAndIcon}>
            <Sans size="8" color="black30">
              {title}
            </Sans>
            <View style={styles.icons}>
              <ArrowDownIcon fill="black30" />
            </View>
          </View>
        </View>
      )}
    </>
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
