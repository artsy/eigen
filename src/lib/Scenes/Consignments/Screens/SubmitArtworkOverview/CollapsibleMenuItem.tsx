import { track as _track } from "lib/utils/track"
import { Sans } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, Separator } from "palette"
import React, { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { SaveAndContinue } from "./SaveAndContinue"
interface Props {
  title: string
  content?: string | React.FC | any
  isCompleted?: boolean
  step: number
  totalSteps: number
  activeStep: number
  setActiveStep: any
}

export const CollapsibleMenuItem: React.FC<Props> = ({
  title = "Title",
  content = "Content",
  step,
  totalSteps,
  isCompleted,
  activeStep,
  setActiveStep,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(true)

  useEffect(() => {
    setIsContentVisible(activeStep === step)
  }, [activeStep])

  return (
    <TouchableOpacity
      style={{ padding: 20 }}
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
            {!!isCompleted && (
              <CheckCircleIcon
                fill="green100"
                height={24}
                width={24}
                style={styles.circle}
              />
            )}
            {!!isContentVisible ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </View>
        </View>
      </View>
      {!!isContentVisible && (
        <>
          <Sans size="1" mt="1">
            {content}
          </Sans>
          <SaveAndContinue
            setIsContentVisible={setIsContentVisible}
            setActiveStep={setActiveStep}
            step={step}
            totalSteps={totalSteps}
            activeStep={activeStep}
          />
        </>
      )}
      <Separator marginTop="40" marginBottom="20" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  titleAndIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
  },
  icons: { flexDirection: "row", alignItems: "center" },
  circle: { marginRight: 5 },
})
