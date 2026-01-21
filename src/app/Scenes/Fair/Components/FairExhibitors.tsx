import { Box, Flex, Tabs, useSpace } from "@artsy/palette-mobile"
import { ListRenderItem } from "@shopify/flash-list"
import { FairExhibitors_fair$data } from "__generated__/FairExhibitors_fair.graphql"
import Spinner from "app/Components/Spinner"
import { FAIR2_EXHIBITORS_PAGE_SIZE } from "app/Components/constants"
import { FairTabError } from "app/Scenes/Fair/Components/FairTabError"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useCallback } from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { FairExhibitorRailQueryRenderer } from "./FairExhibitorRail"

interface FairExhibitorsProps {
  fair: FairExhibitors_fair$data
  relay: RelayPaginationProp
}

type FairShowArtworks = ExtractNodeType<FairExhibitors_fair$data["exhibitors"]>

const FairExhibitors: React.FC<FairExhibitorsProps> = ({ fair, relay }) => {
  const shows = extractNodes(fair?.exhibitors)
  const space = useSpace()
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

  const renderItem: ListRenderItem<FairShowArtworks> = useCallback(({ item: show }) => {
    return (
      <Box key={show.id} mb={4}>
        <FairExhibitorRailQueryRenderer showID={show.internalID} />
      </Box>
    )
  }, [])

  const keyExtractor = (item: FairShowArtworks) => String(item?.id)

  return (
    <Tabs.FlashList
      // reseting padding to -2 to remove the default padding from the FlatList
      contentContainerStyle={{ marginHorizontal: 0, marginTop: space(2) }}
      data={showsWithArtworks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMoreExhibitors}
      // Only load the next page when the user is 20% away from the end of the list
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
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
      @argumentDefinitions(first: { type: "Int", defaultValue: 3 }, after: { type: "String" }) {
        internalID
        slug
        exhibitors: showsConnection(first: $first, after: $after, sort: FEATURED_ASC)
          @connection(key: "FairExhibitorsQuery_exhibitors") {
          edges {
            node {
              id
              internalID
              counts {
                artworks
              }
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
      query FairExhibitorsPaginationQuery($id: String!, $first: Int!, $after: String) {
        fair(id: $id) {
          ...FairExhibitors_fair @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)

export const fairExhibitorsQuery = graphql`
  query FairExhibitorsQuery($fairID: String!) @cacheable {
    fair(id: $fairID) {
      ...FairExhibitors_fair
    }
  }
`

export const FairExhibitorsQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => {
  return (
    <QueryRenderer
      environment={getRelayEnvironment()}
      query={fairExhibitorsQuery}
      variables={{ fairID: fairID }}
      render={renderWithPlaceholder({
        Container: FairExhibitorsFragmentContainer,
        renderPlaceholder: () => <FairExhibitorsPlaceholder />,
        renderFallback: (fallbackProps) => <FairTabError {...fallbackProps} />,
      })}
    />
  )
}

const FairExhibitorsPlaceholder: React.FC = () => {
  const space = useSpace()

  return (
    <Tabs.ScrollView
      contentContainerStyle={{ marginHorizontal: space(2), marginTop: space(2) }}
      // Do not allow scrolling while the fair is loading because there is nothing to show
      scrollEnabled={false}
    >
      <Flex>
        <Spinner />
      </Flex>
    </Tabs.ScrollView>
  )
}
