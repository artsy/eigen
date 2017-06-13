import * as React from "react"
import Welcome from "./setup/welcome"

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
  // constructor(props) {
  //   super(props)
  //   // TODO: Pull out state from KV store like defaults?
  // }

  // handleLayout = (event: LayoutChangeEvent) => {
  //   const { nativeEvent: { layout: { width } } } = event
  //   const margin = width > 700 ? 40 : 20
  //   const height = width > 700 ? 300 : 160
  //   const fontSize = width > 700 ? 30 : 20
  //   this.setState({ width, height, margin, fontSize })
  // }

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
