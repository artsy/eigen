import { Theme } from "@artsy/palette"
import { CitySavedList_viewer } from "__generated__/CitySavedList_viewer.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props {
  viewer: CitySavedList_viewer
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
      viewer: {
        me: {
          followsAndSaves: {
            shows: { edges },
          },
        },
        city: { name },
      },
      relay,
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <Theme>
        <EventList
          header="Saved shows"
          cityName={name}
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
  graphql`
    fragment CitySavedList_viewer on Viewer
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
      city(slug: $citySlug) {
        name
      }
      me {
        followsAndSaves {
          shows(first: $count, status: CURRENT, dayThreshold: 30, city: $citySlug, after: $cursor)
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
                }
              }
            }
          }
        }
      }
    }
  `,
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.viewer.me && props.viewer.me.followsAndSaves && props.viewer.me.followsAndSaves.shows
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
        viewer {
          ...CitySavedList_viewer @arguments(city: $citySlug, count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
