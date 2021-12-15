// import { render } from "@testing-library/react-native"
// import { Theme } from "palette"
// import React, { useState } from "react"
// import { Text, View } from "react-native"
// import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

// export const DisplayContent = () => {
//   return (
//     <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
//       <Text>This is the collapsible menu content</Text>
//     </View>
//   )
// }

// // WIP

// export const ComponentWithCollapsibleMenuEnabled = () => {
//   const totalSteps = 3
//   const [activeStep, setActiveStep] = useState(1)
//   const [enabledSteps, setEnabledSteps] = useState([1])

//   return (
//     <Theme>
//       <View style={{ margin: 20 }}>
//         <CollapsibleMenuItem
//           step={1}
//           totalSteps={totalSteps}
//           title="Press to Collapse"
//           activeStep={activeStep}
//           enabledSteps={enabledSteps}
//           enabled
//           setEnabledSteps={setEnabledSteps}
//           setActiveStep={setActiveStep}
//         />
//       </View>
//     </Theme>
//   )
// }
// export const ComponentWithCollapsibleMenuEnabledAndExpanded = () => {
//   const totalSteps = 3
//   const [activeStep, setActiveStep] = useState(1)
//   const [enabledSteps, setEnabledSteps] = useState([1])

//   return (
//     <Theme>
//       <View style={{ margin: 20 }}>
//         <CollapsibleMenuItem
//           step={1}
//           totalSteps={totalSteps}
//           title="Press to Collapse"
//           activeStep={activeStep}
//           enabledSteps={enabledSteps}
//           enabled
//           setEnabledSteps={setEnabledSteps}
//           setActiveStep={setActiveStep}
//         />
//       </View>
//     </Theme>
//   )
// }
// describe("Collapsible menu: active state", () => {
//   it("is visible when isContentVisible is true", () => {
//     console.log("inside testsssssssssssss")
//     const { getByText } = render(<ComponentWithCollapsibleMenuEnabled />)
//     expect(getByText("Press to Collapse")).toBeDefined()
//   })
// })
// describe("Collapsible menu: Inactive state", () => {
//   it("is visible when isContentVisible is true", () => {
//     const { getByText } = render(<ComponentWithCollapsibleMenuEnabled />)
//     expect(getByText("Press to Collapse")).toHaveStyle({ color: 'black30' })
//   })
// })
