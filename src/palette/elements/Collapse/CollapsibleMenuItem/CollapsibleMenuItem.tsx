import { navigate } from "lib/navigation/navigate"
import { Box, Flex, Sans, Spacer } from "palette"
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LayoutAnimation } from "react-native"
import styled from "styled-components/native"
import { SaveAndContinueButton } from "./SaveAndContinueButton"

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
  Content: React.FC
}

export const CollapsibleMenuItem: React.FC<CollapsibleMenuItemProps> = ({
  enabled,
  title,
  stepNumber,
  totalSteps,
  activeStep,
  setActiveStep,
  enabledSteps,
  setEnabledSteps,
  navigateToLink = "",
  Content,
}) => {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLastStep, setIsLastStep] = useState(false)

  const handleClick = () => {
    if (isLastStep) {
      navigate(navigateToLink)
    }
  }

  useEffect(() => {
    setIsLastStep(stepNumber === totalSteps)

    if (isCompleted) {
      setActiveStep(activeStep + 1)
      setEnabledSteps([...enabledSteps, activeStep + 1])
    }
  }, [isCompleted])

  if (!enabled) {
    // NOT CLICKABLE
    return (
      <Box>
        <Sans size="1" color="black30">
          Step {stepNumber} of {totalSteps}
        </Sans>
        <Flex flexDirection="row" justifyContent="space-between">
          <Sans size="8" color="black30">
            {title}
          </Sans>
          <Flex flexDirection="row" alignItems="center">
            <ArrowDownIcon fill="black30" />
          </Flex>
        </Flex>
      </Box>
    )
  }
  return (
    //  CLICKABLE
    <Box>
      <Sans size="1">
        Step {stepNumber} of {totalSteps}
      </Sans>
      <TitleAndIconTouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setActiveStep(stepNumber)
        }}
      >
        <Sans size="8">{title}</Sans>
        <Flex flexDirection="row" alignItems="center">
          {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={{ marginRight: 5 }} />}
          {activeStep === stepNumber ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </Flex>
      </TitleAndIconTouchableOpacity>
      {activeStep === stepNumber && (
        <>
          <Content />
          <Spacer mb={2} />
          <SaveAndContinueButton
            setIsCompleted={setIsCompleted}
            buttonText={isLastStep ? "Submit Artwork" : "Save & Continue"}
            handleClick={handleClick}
          />
        </>
      )}
    </Box>
  )
}

const TitleAndIconTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
`
