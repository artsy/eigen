import React from "react"
import Welcome from "./Screens/Welcome"

import { ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

/** The metadata for a consigned work */
export interface ConsignmentMetadata {
  title: string | null
  year: string | null
  category: string | null
  categoryName: string | null
  medium: string | null
  width: string | null
  height: string | null
  depth: number | null
  unit: string | null
  displayString: string | null // This would look something like "1/5", "5/5"
}

export interface SearchResult {
  internalID: string
  name: string
  image?: {
    url: string
  }
}

export interface Photo {
  file: string
  uploaded?: boolean
  uploading?: boolean
}

export interface ConsignmentSetup {
  submission_id?: string
  state?: "DRAFT" | "SUBMITTED"
  artist?: SearchResult
  photos?: Photo[]
  metadata?: ConsignmentMetadata
  provenance?: string
  editionInfo?: {
    size?: string
    number?: string
  }
  signed?: boolean
  certificateOfAuth?: boolean
  location?: {
    city: string
    state: string
    country: string
  }
  editionScreenViewed?: boolean
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
