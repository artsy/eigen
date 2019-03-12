import { CityBMWList_city } from "__generated__/CityBMWList_city.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props {
  city: CityBMWList_city
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

class CityBMWList extends React.Component<Props, State> {
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
      city: {
        name,
        sponsoredContent: { shows },
      },
      relay,
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <EventList
        key={name + "bmw"}
        cityName={name}
        bucket={shows.edges.map(e => e.node) as any}
        header="BMW Art Guide"
        type="BMW Art Guide"
        relay={relay}
        onScroll={isCloseToBottom(this.fetchData)}
        fetchingNextPage={fetchingNextPage}
      />
    )
  }
}

export default createPaginationContainer(
  CityBMWList,
  {
    city: graphql`
      fragment CityBMWList_city on City
        @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
        name
        sponsoredContent {
          shows(first: $count, after: $cursor, sort: START_AT_ASC) @connection(key: "CityBMWList_shows") {
            edges {
              node {
                id
                _id
                __id
                name
                status
                href
                is_followed
                exhibition_period
                cover_image {
                  url
                }
                location {
                  coordinates {
                    lat
                    lng
                  }
                }
                type
                start_at
                end_at
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
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.city && props.city.sponsoredContent && props.city.sponsoredContent.shows
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
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query CityBMWListQuery($count: Int!, $cursor: String, $citySlug: String!) {
        city(slug: $citySlug) {
          ...CityBMWList_city @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
