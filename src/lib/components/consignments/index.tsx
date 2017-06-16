import * as React from "react"
import Welcome from "./screens/welcome"

import { NavigatorIOS, ViewProperties } from "react-native"

/** The metadata for a consigned work */
export interface ConsignmentMetadata {
  title: string | null
  year: string | null
  category: string | null
  materials: string | null
  width: number | null
  height: number | null
  depth: number | null
  unit: "in" | "cm"
  displayString: string // This would look something like "1/5", "5/5"
}

export interface ConsignmentSetup {
  artist?: any
  photos?: string[]
  metadata?: ConsignmentMetadata
  location?: string
  provenance?: string
}

interface Props extends ViewProperties, ConsignmentSetup {}

export default class Consignments extends React.Component<Props, any> {
  render() {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: Welcome,
          title: "Welcome",
        }}
        style={{ flex: 1 }}
      />
    )
  }
}
