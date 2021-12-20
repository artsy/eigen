import { render } from "@testing-library/react-native"
import { Theme } from "palette"
import React, { useState } from "react"
import { Text, View } from "react-native"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const Content1: React.FC = ({}) => {
  return (
    <View>
      <Text>Content 1</Text>
    </View>
  )
}
export const Content2: React.FC = ({}) => {
  return (
    <View>
      <Text>Content 2</Text>
    </View>
  )
}
export const Content3: React.FC = ({}) => {
  return (
    <View>
      <Text>Content 3</Text>
    </View>
  )
}

export const ComponentWithCollapsibleMenuEnabled = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  const [enabledSteps, setEnabledSteps] = useState([1])

  const items = [
    { stepNumber: 1, title: "Artwork Details", Content: Content1 },
    { stepNumber: 2, title: "2nd component", Content: Content2 },
    { stepNumber: 3, title: "3nd component", Content: Content3 },
  ]
  return (
    <Theme>
      <View>
        {items.map((item) => {
          const { stepNumber, title, Content } = item
          return (
            <CollapsibleMenuItem
              key={title}
              title={title}
              stepNumber={stepNumber}
              enabled={enabledSteps.includes(stepNumber)}
              totalSteps={totalSteps}
              activeStep={activeStep}
              enabledSteps={enabledSteps}
              setActiveStep={setActiveStep}
              setEnabledSteps={setEnabledSteps}
              Content={() => <Content />}
            />
          )
        })}
      </View>
    </Theme>
  )
}

describe("Collapsible item: active state", () => {
  it("is renders collapsible menu item enabled and active", () => {
    const { getByText } = render(<ComponentWithCollapsibleMenuEnabled />)
    expect(getByText("Content 1")).toBeDefined()
  })
})
