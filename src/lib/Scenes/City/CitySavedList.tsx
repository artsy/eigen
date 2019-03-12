import { Box, Theme } from "@artsy/palette"
import { CitySavedList_me } from "__generated__/CitySavedList_me.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props {
  me: CitySavedList_me
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

class CitySavedList extends React.Component<Props, State> {
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
      me: {
        followsAndSaves: {
          shows: { edges },
        },
      },
      relay,
    } = this.props
    console.log("this props ?????", this.props)
    const { fetchingNextPage } = this.state
    return (
      <Theme>
        <EventList
          header="Saved shows"
          key={"??" + "save"}
          cityName={"??"}
          bucket={edges.map(e => e.node) as any}
          type="saved"
          relay={relay}
          onScroll={isCloseToBottom(this.fetchData)}
          fetchingNextPage={fetchingNextPage}
        />
      </Theme>
    )
  }
}

export default createPaginationContainer(
  CitySavedList,
  {
    me: graphql`
      fragment CitySavedList_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
        followsAndSaves {
          shows(first: $count, status: CURRENT, city: $citySlug, after: $cursor)
            @connection(key: "CitySavedList_shows") {
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
      return props.me && props.me.followsAndSaves && props.me.followsAndSaves.shows
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
      query CitySavedListQuery($count: Int!, $cursor: String, $citySlug: String!) {
        me {
          ...CitySavedList_me @arguments(city: $citySlug, count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
