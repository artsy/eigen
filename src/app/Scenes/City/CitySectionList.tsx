import { CitySectionList_city$data } from "__generated__/CitySectionList_city.graphql"
import {
  CitySectionListQuery,
  EventStatus,
  PartnerShowPartnerType,
  ShowSorts,
} from "__generated__/CitySectionListQuery.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "app/utils/track"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { BucketKey } from "../Map/bucketCityResults"
import { EventList } from "./Components/EventList"

interface Props extends Pick<CitySectionListQuery["variables"], "dayThreshold" | "status"> {
  city: CitySectionList_city$data
  citySlug: string
  section: BucketKey
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
@screenTrack((props: Props) => {
  let contextScreen
  switch (props.section) {
    case "opening":
      contextScreen = Schema.PageNames.CityGuideOpeningSoonList
      break
    case "museums":
      contextScreen = Schema.PageNames.CityGuideMuseumsList
      break
    case "closing":
      contextScreen = Schema.PageNames.CityGuideClosingSoonList
      break
    case "galleries":
      contextScreen = Schema.PageNames.CityGuideGalleriesList
      break
  }
  return {
    context_screen: contextScreen,
    context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
    context_screen_owner_slug: props.citySlug,
    context_screen_owner_id: props.citySlug,
  }
})
class CitySectionList extends React.Component<Props, State> {
  state = {
    fetchingNextPage: false,
  }

  fetchData = () => {
    const { relay } = this.props

    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    this.setState({ fetchingNextPage: true })
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error("CitySectionList.tsx #fetchData", error.message)
        // FIXME: Handle error
      }
      this.setState({ fetchingNextPage: false })
    })
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const {
      section,
      city: { name, shows },
      relay,
    } = this.props
    const { fetchingNextPage } = this.state
    let headerText
    switch (section) {
      case "galleries":
        headerText = "Gallery shows"
        break
      case "museums":
        headerText = "Museum shows"
        break
      case "closing":
        headerText = "Closing soon"
        break
      case "opening":
        headerText = "Opening soon"
        break
    }
    return (
      <EventList
        key={name + section}
        cityName={name as any /* STRICTNESS_MIGRATION */}
        header={headerText}
        bucket={extractNodes(shows)}
        type={section}
        relay={relay as any /* STRICTNESS_MIGRATION */}
        onScroll={isCloseToBottom(this.fetchData) as any /* STRICTNESS_MIGRATION */}
        fetchingNextPage={fetchingNextPage}
      />
    )
  }
}

export const CitySectionListContainer = createPaginationContainer(
  CitySectionList,
  {
    city: graphql`
      fragment CitySectionList_city on City
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String", defaultValue: "" }
        partnerType: { type: "PartnerShowPartnerType" }
        status: { type: "EventStatus" }
        dayThreshold: { type: "Int" }
        sort: { type: "ShowSorts", defaultValue: PARTNER_ASC }
      ) {
        name
        shows: showsConnection(
          includeStubShows: true
          first: $count
          sort: $sort
          after: $cursor
          partnerType: $partnerType
          status: $status
          dayThreshold: $dayThreshold
        ) @connection(key: "CitySectionList_shows") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              id
              slug
              internalID
              isStubShow
              is_followed: isFollowed
              start_at: startAt
              end_at: endAt
              status
              href
              type
              name
              cover_image: coverImage {
                url
              }
              exhibition_period: exhibitionPeriod(format: SHORT)
              partner {
                ... on Partner {
                  name
                  type
                  profile {
                    image {
                      url(version: "square")
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.city && props.city.shows
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        citySlug: props.citySlug,
        status: props.status,
        dayThreshold: props.dayThreshold,
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query CitySectionListPaginationQuery(
        $count: Int!
        $cursor: String
        $citySlug: String!
        $partnerType: PartnerShowPartnerType
        $status: EventStatus
        $dayThreshold: Int
        $sort: ShowSorts
      ) {
        city(slug: $citySlug) {
          ...CitySectionList_city
            @arguments(
              count: $count
              cursor: $cursor
              partnerType: $partnerType
              status: $status
              sort: $sort
              dayThreshold: $dayThreshold
            )
        }
      }
    `,
  }
)

interface CitySectionListProps {
  citySlug: string
  section: BucketKey
}
export const CitySectionListQueryRenderer: React.FC<CitySectionListProps> = ({
  citySlug,
  section,
}) => {
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
    <QueryRenderer<CitySectionListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CitySectionListQuery(
          $citySlug: String!
          $partnerType: PartnerShowPartnerType
          $status: EventStatus
          $dayThreshold: Int
          $sort: ShowSorts
        ) {
          city(slug: $citySlug) {
            ...CitySectionList_city
              @arguments(
                partnerType: $partnerType
                status: $status
                sort: $sort
                dayThreshold: $dayThreshold
              )
          }
        }
      `}
      variables={variables}
      render={renderWithLoadProgress(CitySectionListContainer)}
    />
  )
}
