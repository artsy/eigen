import React from "react"
import styled from "styled-components"

import { Flex, Sans, Tab, Tabs, TabsProps } from "../"
import { space } from "../../helpers"
import { CheckIcon, ChevronIcon } from "../../svgs"
import { sharedTabsStyles } from "../Tabs"

interface StepperProps extends TabsProps {
  /** The initial step stepper renders */
  initialTabIndex?: number

  /** The step user currently is at (e.g. previous steps completed) */
  currentStepIndex: number

  disableNavigation?: boolean
}

/** Stepper */
export const Stepper = (props: StepperProps) => {
  return (
    <Tabs
      // This key is required to ensure the tab state updates with
      // the currentStepIndex change
      key={props.currentStepIndex}
      separator={
        <ChevronWrapper>
          <ChevronIcon fill="black30" width="12px" />
        </ChevronWrapper>
      }
      transformTabBtn={transformTabBtn}
      {...props}
    />
  )
}

/** Step */
export const Step = props => <Tab {...props} />

const DisabledStepButton = ({ children }) => (
  <DisabledStepContainer>
    <Sans size="3t" color="black30">
      {children}
    </Sans>
  </DisabledStepContainer>
)

const transformTabBtn = (
  element: JSX.Element,
  tabIndex: number,
  props: any
): JSX.Element => {
  const { currentStepIndex, initialTabIndex = 0, disableNavigation } = props
  const returnDisabledButton = disableNavigation && tabIndex !== initialTabIndex

  const disabledButton = (
    <DisabledStepButton key={tabIndex}>
      {element.props.children}
    </DisabledStepButton>
  )

  // Don't allow users to jump ahead
  if (tabIndex > currentStepIndex) {
    return disabledButton

    // Step done
  } else if (currentStepIndex && tabIndex < currentStepIndex) {
    return (
      <Flex key={tabIndex}>
        <CheckMarkWrapper>
          <CheckIcon fill="green100" />
        </CheckMarkWrapper>
        {returnDisabledButton && tabIndex !== initialTabIndex
          ? disabledButton
          : element}
        <div /> {/* hack for getting rid of last-child in Tabs.tsx */}
      </Flex>
    )
    // Disabled
  } else if (returnDisabledButton) {
    return disabledButton

    // Step
  } else {
    return element
  }
}

const ChevronWrapper = styled.span`
  margin: 0 ${space(2)}px;
  line-height: normal;
`

/** CheckMarkWrapper */
export const CheckMarkWrapper = styled.span`
  margin-right: ${space(1)}px;
  line-height: normal;
`

const DisabledStepContainer = styled.div`
  ${sharedTabsStyles.tabContainer};
  cursor: default;
`
