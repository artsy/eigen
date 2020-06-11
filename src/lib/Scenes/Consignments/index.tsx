import { ConsignmentSubmissionCategoryAggregation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import React from "react"
import { NativeModules, ViewProperties } from "react-native"
import NavigatorIOS, { Route } from "react-native-navigator-ios"
import Welcome from "./Screens/Welcome"
import { SellTabApp } from "./v2/SellTabApp"

/** The metadata for a consigned work */
export interface ConsignmentMetadata {
  title: string | null
  year: string | null
  category: ConsignmentSubmissionCategoryAggregation | null
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

interface Props extends ViewProperties, ConsignmentSetup {
  navigator: NavigatorIOS
  route: Route
}

export const Consignments: React.FC<Props> = props => {
  const featureFlag = NativeModules?.Emission?.options?.AROptionsEnableSales
  return <>{featureFlag ? <SellTabApp /> : <Welcome navigator={props.navigator} route={props.route} />}</>
}
