import { track as _track } from "lib/utils/track"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { Dispatch, SetStateAction, useState } from "react"
import { Text, View } from "react-native"
import { ComponentWithCollapsibleMenuItemProps } from "./types"
export interface CollapsibleMenuItemProps {
  setFormCompleted: Dispatch<SetStateAction<number>>
}

export const ContactInformationContent = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>Contact Information Content</Text>
      <Text>Form</Text>
    </View>
  )
}

export const ContactInformation: React.FC<ComponentWithCollapsibleMenuItemProps> = ({
  activeStep,
  setActiveStep,
  totalSteps,
  step,
}) => {
  // setFormCompleted
  const [isCompleted, setIsCompleted] = useState(false)
  return (
    <CollapsibleMenuItem
      title="Contact Information"
      activeStep={activeStep}
      step={step}
      setActiveStep={setActiveStep}
      isCompleted={isCompleted}
      setIsCompleted={setIsCompleted}
      Content={() => <ContactInformationContent />}
      totalSteps={totalSteps}
      navigateToLink="artwork-submitted"
    />
  )
}
