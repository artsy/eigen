import * as React from "react"
import Welcome from "./Screens/Welcome"

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

export interface SearchResult {
  id: string
  name: string
  image?: {
    url: string
  }
}

export interface ConsignmentSetup {
  artist?: SearchResult
  photos?: string[]
  metadata?: ConsignmentMetadata
  location?: string
  provenance?: string
  editionInfo?: {
    size?: string
    number?: string
  }
  signed?: boolean
  certificateOfAuth?: boolean
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
