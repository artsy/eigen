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

// export const ComponentWithCollapsibleMenu = () => {
//   const totalSteps = 3
//   const [activeStep, setActiveStep] = useState(1)

//   return (
//     <Theme>
//       <View style={{ margin: 20 }}>
//         <CollapsibleMenuItem
//           title="Press to Collapse"
//           activeStep={activeStep}
//           step={activeStep}
//           totalSteps={totalSteps}
//           setActiveStep={setActiveStep}
//         />
//       </View>
//     </Theme>
//   )
// }
// describe("Collapse", () => {
//   it("is visible when isContentVisible is true", () => {
//     const { getByText } = render(<ComponentWithCollapsibleMenu />)
//     expect(getByText("Press to Collapse")).toBeDefined()
//   })
// })
