import { Box, Flex, Tabs, useSpace } from "@artsy/palette-mobile"
import { FairExhibitors_fair$data } from "__generated__/FairExhibitors_fair.graphql"
import Spinner from "app/Components/Spinner"
import { FAIR2_EXHIBITORS_PAGE_SIZE } from "app/Components/constants"
import { FairTabError } from "app/Scenes/Fair/Components/FairTabError"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useCallback } from "react"
import { Platform } from "react-native"
import { useHeaderMeasurements } from "react-native-collapsible-tab-view"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { FairExhibitorRailQueryRenderer } from "./FairExhibitorRail"

interface FairExhibitorsProps {
  fair: FairExhibitors_fair$data
  relay: RelayPaginationProp
}

const FairExhibitors: React.FC<FairExhibitorsProps> = ({ fair, relay }) => {
  const shows = extractNodes(fair?.exhibitors)
  const space = useSpace()
  const showsWithArtworks = shows.filter((show) => show?.counts?.artworks ?? 0 > 0)
  const shouldDisplaySpinner = !!shows.length && !!relay.isLoading() && !!relay.hasMore()

  const { height } = useHeaderMeasurements()
  // Tabs.ScrollView paddingTop is not working on Android, so we need to set it manually
  const paddingTop = Platform.OS === "android" ? height + 80 : space(2)

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
        <FairExhibitorRailQueryRenderer showID={show.internalID} />
      </Box>
    )
  }, [])

  const keyExtractor = (item: any) => String(item?.id)

  return (
    <Tabs.FlatList
      // reseting padding to -2 to remove the default padding from the FlatList
      contentContainerStyle={{ padding: -2, paddingTop: paddingTop }}
      data={showsWithArtworks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMoreExhibitors}
      // Only load the next page when the user is 20% away from the end of the list
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        shouldDisplaySpinner ? (
          <Box p={2}>
            <Flex flex={1} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          </Box>
        ) : null
      }
      // We want to limit the number of loaded windows to 5 because the items are pretty heavy
      windowSize={5}
      // We are slowing down the scrolling intentionally because the screen is too heavy and scrolling
      // too fast leads to dropped frames
      decelerationRate={0.995}
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
      contentContainerStyle={{ paddingHorizontal: 0, paddingTop: space(4), width: "100%" }}
      // We don't want to allow scrolling so scroll position isn't lost after the query is complete
      scrollEnabled={false}
    >
      <Flex>
        <Spinner />
      </Flex>
    </Tabs.ScrollView>
  )
}
