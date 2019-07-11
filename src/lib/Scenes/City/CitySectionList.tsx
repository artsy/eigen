import { Theme } from "@artsy/palette"
import { CitySectionList_city } from "__generated__/CitySectionList_city.graphql"
import { CitySectionListQueryVariables } from "__generated__/CitySectionListQuery.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp, RelayProp } from "react-relay"
import { BucketKey } from "../Map/bucketCityResults"
import { EventList } from "./Components/EventList"

interface Props extends Pick<CitySectionListQueryVariables, "dayThreshold" | "status"> {
  city: CitySectionList_city
  citySlug: string
  section: BucketKey
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

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
    relay.loadMore(PAGE_SIZE, error => {
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
      <Theme>
        <EventList
          key={name + section}
          cityName={name}
          header={headerText}
          bucket={shows.edges.map(e => e.node) as any}
          type={section}
          relay={relay as RelayProp}
          onScroll={isCloseToBottom(this.fetchData)}
          fetchingNextPage={fetchingNextPage}
        />
      </Theme>
    )
  }
}

export default createPaginationContainer(
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
          sort: { type: "PartnerShowSorts", defaultValue: "PARTNER_ASC" }
        ) {
        name
        shows(
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
              gravityID
              internalID
              id
              isStubShow
              is_followed
              start_at
              end_at
              status
              href
              type
              name
              cover_image {
                url
              }
              exhibition_period
              partner {
                ... on Partner {
                  name
                  type
                  profile {
                    # This is only used for stubbed shows
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
    direction: "forward",
    getConnectionFromProps(props) {
      return props.city && props.city.shows
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
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
      query CitySectionListQuery(
        $count: Int!
        $cursor: String
        $citySlug: String!
        $partnerType: PartnerShowPartnerType
        $status: EventStatus
        $dayThreshold: Int
        $sort: PartnerShowSorts
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
