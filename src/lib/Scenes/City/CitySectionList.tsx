import { CitySectionList_city } from "__generated__/CitySectionList_city.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { BucketKey } from "../Map/bucketCityResults"
import { EventList } from "./Components/EventList"

interface Props {
  city: CitySectionList_city
  citySlug: string
  section: BucketKey
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

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

  render() {
    const {
      section,
      city: { name, shows },
      relay,
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <EventList
        key={name + section}
        cityName={name}
        bucket={shows.edges}
        type={section}
        relay={relay}
        onScroll={isCloseToBottom(this.fetchData)}
        fetchingNextPage={fetchingNextPage}
      />
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
        ) {
        name
        shows(
          includeStubShows: true
          first: $count
          sort: START_AT_ASC
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
              _id
              __id
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
                }
                ... on ExternalPartner {
                  name
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
        dayThreshold: props.dayThreshould,
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
      ) {
        city(slug: $citySlug) {
          ...CitySectionList_city
            @arguments(
              count: $count
              cursor: $cursor
              partnerType: $partnerType
              status: $status
              dayThreshold: $dayThreshold
            )
        }
      }
    `,
  }
)
