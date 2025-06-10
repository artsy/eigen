import { CitySavedListQuery } from "__generated__/CitySavedListQuery.graphql"
import { CitySavedList_city$data } from "__generated__/CitySavedList_city.graphql"
import { CitySavedList_me$data } from "__generated__/CitySavedList_me.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "app/utils/track"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props {
  me: CitySavedList_me$data
  city: CitySavedList_city$data
  relay: RelayPaginationProp
  citySlug: string
}

interface State {
  fetchingNextPage: boolean
}

@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.CityGuideSavedList,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.citySlug,
  context_screen_owner_id: props.citySlug,
}))
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
    const { fetchingNextPage } = this.state
    return (
      <EventList
        header="Saved shows"
        cityName={this.props.city.name}
        bucket={extractNodes(this.props.me.followsAndSaves?.shows)}
        type="saved"
        onScroll={isCloseToBottom(this.fetchData) as any}
        fetchingNextPage={fetchingNextPage}
      />
    )
  }
}

export const CitySavedListContainer = createPaginationContainer(
  CitySavedList,
  {
    city: graphql`
      fragment CitySavedList_city on City {
        name
      }
    `,
    me: graphql`
      fragment CitySavedList_me on Me
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String", defaultValue: "" }
      ) {
        followsAndSaves {
          shows: showsConnection(
            first: $count
            status: RUNNING_AND_UPCOMING
            city: $citySlug
            after: $cursor
          ) @connection(key: "CitySavedList_shows") {
            edges {
              node {
                slug
                internalID
                id
                name
                isStubShow
                status
                href
                is_followed: isFollowed
                isStubShow
                exhibition_period: exhibitionPeriod(format: SHORT)
                cover_image: coverImage {
                  url
                }
                location {
                  coordinates {
                    lat
                    lng
                  }
                }
                type
                start_at: startAt
                end_at: endAt
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
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me && props.me.followsAndSaves && props.me.followsAndSaves.shows
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
      query CitySavedListPaginationQuery($count: Int!, $cursor: String, $citySlug: String!) {
        me {
          ...CitySavedList_me @arguments(count: $count, cursor: $cursor)
        }
        city(slug: $citySlug) {
          ...CitySavedList_city
        }
      }
    `,
  }
)

interface CitySavedListProps {
  citySlug: string
}
export const CitySavedListScreenQuery = graphql`
  query CitySavedListQuery($citySlug: String!) {
    me {
      ...CitySavedList_me
    }
    city(slug: $citySlug) {
      ...CitySavedList_city
    }
  }
`

export const CitySavedListQueryRenderer: React.FC<CitySavedListProps> = ({ citySlug }) => {
  return (
    <QueryRenderer<CitySavedListQuery>
      environment={getRelayEnvironment()}
      query={CitySavedListScreenQuery}
      variables={{ citySlug }}
      render={renderWithLoadProgress(CitySavedListContainer)}
    />
  )
}
