import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NewWorksForYouRail_me } from "__generated__/NewWorksForYouRail_me.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spinner } from "palette"
import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { SmallTileRailContainer } from "./SmallTileRail"
import { RailScrollProps } from "./types"

const PAGE_SIZE = 10
const MAX_ARTWORKS = 30

interface NewWorksForYouRailProps {
  title: string
  me: NewWorksForYouRail_me
  relay: RelayPaginationProp
  mb?: number
}

const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = ({
  title,
  me,
  relay,
  scrollRef,
  mb,
}) => {
  const { trackEvent } = useTracking()

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const { hasMore, isLoading, loadMore } = relay
  // TODO: Add spinner when loading more data
  const [loadingMoreData, setLoadingMoreData] = useState(false)

  // This is to satisfy the TypeScript compiler based on Metaphysics types.
  const artworks = extractNodes(me?.newWorksByInterestingArtists)

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading() || artworks.length >= MAX_ARTWORKS) {
      return
    }

    setLoadingMoreData(true)

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error(error.message)
      }

      setLoadingMoreData(false)
    })
  }

  if (!artworks.length) {
    return null
  }

  const navigateToNewWorksForYou = () => {
    trackEvent(tracks.tappedHeader())
    navigate(`/new-works-for-you`)
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle title={title} onPress={navigateToNewWorksForYou} />
        </Flex>
        <SmallTileRailContainer
          listRef={listRef}
          artworks={artworks as any}
          contextModule={ContextModule.newWorksForYouRail}
          onEndReached={loadMoreArtworks}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loadingMoreData ? (
              <Flex justifyContent="center" ml={3} mr={5} height="120">
                <Spinner />
              </Flex>
            ) : undefined
          }
        />
      </View>
    </Flex>
  )
}

export const NewWorksForYouRailContainer = createPaginationContainer(
  NewWorksForYouRail,
  {
    me: graphql`
      fragment NewWorksForYouRail_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        newWorksByInterestingArtists(first: $count, after: $cursor)
          @connection(key: "NewWorksForYouRail_newWorksByInterestingArtists") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              ...SmallTileRail_artworks
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.newWorksByInterestingArtists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query NewWorksForYouRailQuery($cursor: String, $count: Int!) {
        me {
          ...NewWorksForYouRail_me @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  }
)

const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.newWorksForYou,
    type: "header",
  }),
}
