import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { EventStatus, ShowSorts } from "__generated__/CitySectionListQuery.graphql"
import { QueryRenderersCitySavedListQuery } from "__generated__/QueryRenderersCitySavedListQuery.graphql"
import { PartnerShowPartnerType } from "__generated__/QueryRenderersCitySectionListQuery.graphql"
import { QueryRenderersCitySectionListQuery } from "__generated__/QueryRenderersCitySectionListQuery.graphql"
import { BucketKey } from "lib/Scenes/Map/bucketCityResults"
import { defaultEnvironment as environment } from "./createEnvironment"

export type RenderCallback = React.ComponentProps<typeof QueryRenderer>["render"]

interface RendererProps {
  render: RenderCallback
}

interface CitySavedListProps extends RendererProps {
  citySlug: string
}
export const CitySavedListRenderer: React.SFC<CitySavedListProps> = ({ render, citySlug }) => {
  return (
    <QueryRenderer<QueryRenderersCitySavedListQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersCitySavedListQuery($citySlug: String!) {
          ...CitySavedList_viewer
        }
      `}
      variables={{ citySlug }}
      render={render}
    />
  )
}

interface CitySectionListProps extends RendererProps {
  citySlug: string
  section: BucketKey
}
export const CitySectionListRenderer: React.SFC<CitySectionListProps> = ({ render, citySlug, section }) => {
  const variables: {
    citySlug: string
    partnerType?: PartnerShowPartnerType
    status?: EventStatus
    dayThreshold?: number
    sort?: ShowSorts
  } = { citySlug }

  switch (section) {
    case "museums":
      variables.partnerType = "MUSEUM"
      variables.status = "RUNNING"
      variables.sort = "PARTNER_ASC"
      break
    case "galleries":
      variables.partnerType = "GALLERY"
      variables.status = "RUNNING"
      variables.sort = "PARTNER_ASC"
      break
    case "closing":
      variables.status = "CLOSING_SOON"
      variables.sort = "END_AT_ASC"
      variables.dayThreshold = 7
      break
    case "opening":
      variables.status = "UPCOMING"
      variables.sort = "START_AT_ASC"
      variables.dayThreshold = 14
  }

  return (
    <QueryRenderer<QueryRenderersCitySectionListQuery>
      environment={environment}
      query={graphql`
        query QueryRenderersCitySectionListQuery(
          $citySlug: String!
          $partnerType: PartnerShowPartnerType
          $status: EventStatus
          $dayThreshold: Int
          $sort: ShowSorts
        ) {
          city(slug: $citySlug) {
            ...CitySectionList_city
              @arguments(partnerType: $partnerType, status: $status, sort: $sort, dayThreshold: $dayThreshold)
          }
        }
      `}
      variables={variables}
      render={render}
    />
  )
}
