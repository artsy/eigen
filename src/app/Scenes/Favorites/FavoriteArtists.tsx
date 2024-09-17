import { Spacer, Tabs, Flex, useSpace } from "@artsy/palette-mobile"
import { FavoriteArtistsQuery } from "__generated__/FavoriteArtistsQuery.graphql"
import { FavoriteArtists_me$data } from "__generated__/FavoriteArtists_me.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import React, { useState, useCallback, useMemo } from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { FragmentRefs } from "relay-runtime"

interface Props {
  me: FavoriteArtists_me$data
  relay: RelayPaginationProp
}

const Artists: React.FC<Props> = ({ me, relay }) => {
  const space = useSpace()
  const [fetchingMoreData, setFetchingMoreData] = useState(false)
  const [refreshingFromPull, setRefreshingFromPull] = useState(false)

  const loadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    setFetchingMoreData(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx", error.message)
      }
      setFetchingMoreData(false)
    })
  }, [relay])

  const handleRefresh = useCallback(() => {
    setRefreshingFromPull(true)
    relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx #handleRefresh", error.message)
      }
      setRefreshingFromPull(false)
    })
  }, [relay])

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: {
        readonly artist:
          | {
              readonly id: string
              readonly " $fragmentSpreads": FragmentRefs<"ArtistListItem_artist">
            }
          | null
          | undefined
      }
    }) => {
      if (item.artist)
        return (
          <ArtistListItem
            artist={item.artist}
            withFeedback
            containerStyle={{ paddingHorizontal: space(2), paddingVertical: space(0.5) }}
          />
        )

      return null
    },
    [me.followsAndSaves?.artists]
  )

  const keyExtractor = useCallback(
    (item: { artist?: { id: string } | null }, index: number): string => {
      return `${item.artist?.id}-${index}`
    },
    []
  )

  const artists = useMemo(
    () => extractNodes(me.followsAndSaves?.artists),
    [me.followsAndSaves?.artists]
  )

  if (artists.length === 0) {
    return (
      <Tabs.ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshingFromPull} onRefresh={handleRefresh} />
        }
      >
        <ZeroState
          title="You haven’t followed any artists yet"
          subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
        />
      </Tabs.ScrollView>
    )
  }

  return (
    <Tabs.FlashList
      data={artists}
      onEndReached={loadMore}
      estimatedItemSize={80}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingVertical: space(1) }}
      onEndReachedThreshold={0.2}
      refreshControl={<RefreshControl refreshing={refreshingFromPull} onRefresh={handleRefresh} />}
      style={{ paddingHorizontal: 0 }}
      ItemSeparatorComponent={() => <Spacer y={1} />}
      ListHeaderComponent={<Spacer y={2} />}
      ListFooterComponent={
        fetchingMoreData ? (
          <Flex my={4} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Spacer y={2} />
        )
      }
      renderItem={renderItem}
    />
  )
}

const FavoriteArtistsContainer = createPaginationContainer(
  Artists,
  {
    me: graphql`
      fragment FavoriteArtists_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        labFeatures
        followsAndSaves {
          artists: artistsConnection(first: $count, after: $cursor)
            @connection(key: "Artists_artists") {
            edges {
              node {
                artist {
                  id
                  ...ArtistListItem_artist
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
      return props.me.followsAndSaves?.artists
    },
    getVariables(_props, pageInfo, _fragmentVariables) {
      return pageInfo
    },
    query: graphql`
      query FavoriteArtistsPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...FavoriteArtists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FavoriteArtistsQueryRenderer = () => {
  return (
    <QueryRenderer<FavoriteArtistsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query FavoriteArtistsQuery {
          me {
            ...FavoriteArtists_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(FavoriteArtistsContainer)}
    />
  )
}
