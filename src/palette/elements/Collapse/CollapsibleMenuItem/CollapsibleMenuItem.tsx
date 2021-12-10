import { track as _track } from "lib/utils/track"
import { Sans } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon } from "palette"
import React, { Dispatch, SetStateAction, useState } from "react"
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from "react-native"
import { Content } from "./Content"

interface CollapsibleMenuItemProps {
  step: number
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
  step,
  totalSteps,
  activeStep,
  setActiveStep,
  enabledSteps,
  setEnabledSteps,
  navigateToLink,
}) => {
  return (
    <>
      {enabled ? (
        <Active
          step={step}
          totalSteps={totalSteps}
          title={title}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          enabledSteps={enabledSteps}
          setEnabledSteps={setEnabledSteps}
          navigateToLink={navigateToLink}
        />
      ) : (
        <Inactive step={step} totalSteps={totalSteps} title={title} />
      )}
    </>
  )
}

interface ActiveProps {
  step: number
  totalSteps: number
  activeStep: number
  title: string
  navigateToLink?: string
  enabledSteps: number[]
  setActiveStep: Dispatch<SetStateAction<number>>
  setEnabledSteps: Dispatch<SetStateAction<number[]>>
}
const Active: React.FC<ActiveProps> = ({
  title,
  step,
  totalSteps,
  activeStep,
  setActiveStep,
  enabledSteps,
  setEnabledSteps,
  navigateToLink,
}) => {
  const [isCompleted, setIsCompleted] = useState(false)
  return (
    <View style={styles.container}>
      <Sans size="1">
        Step {step} of {totalSteps}
      </Sans>
      <TouchableOpacity
        style={styles.titleAndIcon}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setActiveStep(step)
        }}
      >
        <Sans size="8">{title}</Sans>
        <View style={styles.icons}>
          {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={styles.circle} />}
          {activeStep === step ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </View>
      </TouchableOpacity>
      {activeStep === step && (
        // these props should be passed directly to the save & continue button
        // implement easy peasy here
        <Content
          activeStep={activeStep}
          totalSteps={totalSteps}
          setActiveStep={setActiveStep}
          enabledSteps={enabledSteps}
          setEnabledSteps={setEnabledSteps}
          setIsCompleted={setIsCompleted}
          navigateToLink={navigateToLink}
        />
      )}
    </View>
  )
}
interface InactiveProps {
  title: string
  step: number
  totalSteps: number
}
const Inactive: React.FC<InactiveProps> = ({ title, step, totalSteps }) => {
  return (
    <View style={styles.container}>
      <Sans size="1" color="black30">
        Step {step} of {totalSteps}
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
