import { Flex, Box, Tabs } from "@artsy/palette-mobile"
import { FairExhibitors_fair$data } from "__generated__/FairExhibitors_fair.graphql"
import Spinner from "app/Components/Spinner"
import { FAIR2_EXHIBITORS_PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import React, { useCallback } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { FairExhibitorRailFragmentContainer } from "./FairExhibitorRail"

interface FairExhibitorsProps {
  fair: FairExhibitors_fair$data
  relay: RelayPaginationProp
}

const FairExhibitors: React.FC<FairExhibitorsProps> = ({ fair, relay }) => {
  const shows = extractNodes(fair?.exhibitors)
  const showsWithArtworks = shows.filter((show) => show?.counts?.artworks ?? 0 > 0)
  const shouldDisplaySpinner = !!shows.length && !!relay.isLoading() && !!relay.hasMore()

  const loadMoreExhibitors = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    relay.loadMore(FAIR2_EXHIBITORS_PAGE_SIZE, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }, [relay.hasMore(), relay.isLoading()])

  const renderItem = useCallback(({ item: show }) => {
    return (
      <Box key={show.id} mb={4}>
        <FairExhibitorRailFragmentContainer show={show} />
      </Box>
    )
  }, [])

  const keyExtractor = (item: any) => String(item?.id)

  return (
    <Tabs.FlatList
      // reseting padding to -2 to remove the default padding from the FlatList
      contentContainerStyle={{ padding: -2 }}
      data={showsWithArtworks}
      ListHeaderComponent={<Flex my={2} />}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMoreExhibitors}
      nestedScrollEnabled
      ListFooterComponent={
        shouldDisplaySpinner ? (
          <Box p={2}>
            <Flex flex={1} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          </Box>
        ) : null
      }
    />
  )
}

export const FairExhibitorsFragmentContainer = createPaginationContainer(
  FairExhibitors,
  {
    fair: graphql`
      fragment FairExhibitors_fair on Fair
      @argumentDefinitions(first: { type: "Int", defaultValue: 30 }, after: { type: "String" }) {
        internalID
        slug
        exhibitors: showsConnection(first: $first, after: $after, sort: FEATURED_ASC)
          @connection(key: "FairExhibitorsQuery_exhibitors") {
          edges {
            node {
              id
              counts {
                artworks
              }
              ...FairExhibitorRail_show
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getVariables({ fair: { slug: id } }, { cursor: after }, { first }) {
      return { first, after, id }
    },
    query: graphql`
      query FairExhibitorsQuery($id: String!, $first: Int!, $after: String) {
        fair(id: $id) {
          ...FairExhibitors_fair @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)
