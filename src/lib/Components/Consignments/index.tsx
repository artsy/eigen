import React from "react"
import Welcome from "./Screens/Welcome"

import { SubmissionCategoryAggregation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

/** The metadata for a consigned work */
export interface ConsignmentMetadata {
  title: string | null
  year: string | null
  category: SubmissionCategoryAggregation | null
  categoryName: string | null
  medium: string | null
  width: string | null
  height: string | null
  depth: number | null
  unit: string | null
  displayString: string | null // This would look something like "1/5", "5/5"
}

export interface LocationResult {
  id: string
  name: string
}

export interface ArtistResult {
  internalID: string
  name: string
  image?: {
    url: string
  }
}

export type SearchResult = LocationResult | ArtistResult

export interface Photo {
  file: string
  uploaded?: boolean
  uploading?: boolean
}

export interface ConsignmentSetup {
  submissionID?: string
  state?: "DRAFT" | "SUBMITTED"
  artist?: ArtistResult
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
