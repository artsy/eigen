import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { useState } from "react"
import { View } from "react-native"
import { withTheme } from "storybook/decorators"

export const DisplayContent = () => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>This is the collapsible menu content</Text>
    </View>
  )
}

export const ComponentWithCollapsibleMenu = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  const [enabledSteps, setEnabledSteps] = useState([1])

  return (
    <View style={{ margin: 20 }}>
      <CollapsibleMenuItem
        stepNumber={1}
        enabled={!!enabledSteps.includes(1)}
        title="Press to Collapse"
        totalSteps={totalSteps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        enabledSteps={enabledSteps}
        setEnabledSteps={setEnabledSteps}
      />
      <CollapsibleMenuItem
        stepNumber={2}
        enabled={!!enabledSteps.includes(2)}
        title="Press to Collapse"
        totalSteps={totalSteps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        enabledSteps={enabledSteps}
        setEnabledSteps={setEnabledSteps}
      />
      <CollapsibleMenuItem
        stepNumber={3}
        enabled={!!enabledSteps.includes(3)}
        title="Press to Collapse"
        totalSteps={totalSteps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        enabledSteps={enabledSteps}
        setEnabledSteps={setEnabledSteps}
      />
    </View>
  )
}

storiesOf("Collapsable Menu ", module)
  .addDecorator(withTheme)
  .add("Collapse Collapse Items", () => (
    <>
      <ComponentWithCollapsibleMenu />
    </>
  ))
