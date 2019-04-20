import { Box, Separator, Serif, Theme } from "@artsy/palette"
import { CityFairList_city } from "__generated__/CityFairList_city.graphql"
import Spinner from "lib/Components/Spinner"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { TabFairItemRow } from "./Components/TabFairItemRow"

interface Props {
  city: CityFairList_city
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.CityGuideFairsList,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.city.slug,
  context_screen_owner_id: props.city.slug,
}))
class CityFairList extends React.Component<Props, State> {
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
        console.error("CityFairList.tsx #fetchData", error.message)
        // FIXME: Handle error
      }
      this.setState({ fetchingNextPage: false })
    })
  }

  renderItem = item => {
    return (
      <Box py={2}>
        <TabFairItemRow item={item.node} />
      </Box>
    )
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const {
      city: {
        fairs: { edges },
      },
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <Theme>
        <Box mx={2}>
          <FlatList
            ListHeaderComponent={() => {
              return (
                <Box pt={6} mt={3} mb={2}>
                  <Serif size="8">Fairs</Serif>
                </Box>
              )
            }}
            data={edges}
            ItemSeparatorComponent={() => <Separator />}
            keyExtractor={item => item.node.gravityID}
            renderItem={({ item }) => this.renderItem(item)}
            onScroll={isCloseToBottom(this.fetchData)}
            ListFooterComponent={!!fetchingNextPage && <Spinner style={{ marginTop: 20, marginBottom: 20 }} />}
          />
        </Box>
      </Theme>
    )
  }
}

export default createPaginationContainer(
  CityFairList,
  {
    city: graphql`
      fragment CityFairList_city on City
        @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
        slug
        fairs(first: $count, after: $cursor, status: CURRENT, sort: START_AT_ASC)
          @connection(key: "CityFairList_fairs") {
          edges {
            node {
              gravityID
              name
              exhibition_period
              counts {
                partners
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              image {
                image_url
                aspect_ratio
                url
              }
              profile {
                icon {
                  gravityID
                  href
                  height
                  width
                  url(version: "square140")
                }
                id
                gravityID
                name
              }
              start_at
              end_at
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.city && props.city.fairs
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
      query CityFairListQuery($count: Int!, $cursor: String, $citySlug: String!) {
        city(slug: $citySlug) {
          ...CityFairList_city @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
