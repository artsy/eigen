import { Button, Spacer, Tabs, useSpace } from "@artsy/palette-mobile"
import { FavoriteArtworksQuery } from "__generated__/FavoriteArtworksQuery.graphql"
import { FavoriteArtworks_me$data } from "__generated__/FavoriteArtworks_me.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { ZeroState } from "app/Components/States/ZeroState"
import { PAGE_SIZE } from "app/Components/constants"
import { navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { FAVORITE_ARTWORKS_REFRESH_KEY, RefreshEvents } from "app/utils/refreshHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useEffect, useState } from "react"
import { Image, RefreshControl } from "react-native"
import { QueryRenderer, RelayPaginationProp, createPaginationContainer, graphql } from "react-relay"

interface Props {
  me: FavoriteArtworks_me$data
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

const SavedWorks: React.FC<Props> = ({ me, relay, onDataFetching }) => {
  const { width } = useScreenDimensions()
  const [refreshingFromPull, setRefreshingFromPull] = useState<boolean>(false)
  const [fetchingMoreData, setFetchingMoreData] = useState<boolean>(false)
  const space = useSpace()

  useEffect(() => {
    RefreshEvents.addListener(FAVORITE_ARTWORKS_REFRESH_KEY, handleRefresh)

    return () => {
      RefreshEvents.removeListener(FAVORITE_ARTWORKS_REFRESH_KEY, handleRefresh)
    }
  }, [])

  const handleRefresh = () => {
    setRefreshingFromPull(true)
    relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx #handleRefresh", error.message)
      }
      setRefreshingFromPull(false)
    })
  }

  const loadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    const updateState = (loading: boolean) => {
      setFetchingMoreData(loading)
      if (onDataFetching) {
        onDataFetching(loading)
      }
    }

    updateState(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx", error.message)
      }
      updateState(false)
    })
  }

  const artworks = extractNodes(me?.followsAndSaves?.artworks)

  if (artworks.length === 0) {
    return (
      <Tabs.ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshingFromPull} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{
          marginHorizontal: space(2),
          flexGrow: 1,
        }}
      >
        <ZeroState
          bigTitle="Keep track of artworks you love"
          subtitle="Tap the heart on an artwork to find it again easily here."
          image={
            <>
              <Spacer y={1} />
              <Image
                source={require("images/SavesEmptyStateImage.webp")}
                resizeMode="contain"
                style={{
                  alignSelf: "center",
                  marginVertical: space(2),
                }}
              />
            </>
          }
          callToAction={
            <Button block onPress={() => navigate("/")}>
              Browse Works
            </Button>
          }
        />
      </Tabs.ScrollView>
    )
  }

  const data = [
    {
      content: (
        <GenericGrid
          artworks={artworks}
          isLoading={fetchingMoreData}
          hidePartner
          artistNamesTextStyle={{ weight: "regular" }}
          saleInfoTextStyle={{ weight: "medium", color: "black100" }}
          width={width - space(2)}
        />
      ),
      key: "grid",
    },
  ]

  return (
    <Tabs.FlatList
      contentContainerStyle={{ marginVertical: space(2), marginHorizontal: space(2) }}
      data={data}
      onEndReached={loadMore}
      renderItem={({ item }) => item.content}
      keyExtractor={({ key }) => key}
      refreshControl={<RefreshControl refreshing={refreshingFromPull} onRefresh={handleRefresh} />}
    />
  )
}

const FavoriteArtworksContainer = createPaginationContainer(
  SavedWorks,
  {
    me: graphql`
      fragment FavoriteArtworks_me on Me
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
      ) {
        labFeatures
        followsAndSaves {
          artworks: artworksConnection(private: true, first: $count, after: $cursor)
            @connection(key: "GenericGrid_artworks") {
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
            edges {
              node {
                ...GenericGrid_artworks
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.followsAndSaves?.artworks
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query FavoriteArtworksPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...FavoriteArtworks_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FavoriteArtworksScreenQuery = graphql`
  query FavoriteArtworksQuery {
    me {
      ...FavoriteArtworks_me
    }
  }
`

export const FavoriteArtworksQueryRenderer = () => {
  const screen = useScreenDimensions()
  return (
    <QueryRenderer<FavoriteArtworksQuery>
      environment={getRelayEnvironment()}
      query={FavoriteArtworksScreenQuery}
      variables={{
        count: 10,
      }}
      render={renderWithPlaceholder({
        Container: FavoriteArtworksContainer,
        renderPlaceholder: () => {
          return (
            <Tabs.ScrollView scrollEnabled={false} style={{ paddingTop: 20 }}>
              <GenericGridPlaceholder width={screen.width - 40} />
            </Tabs.ScrollView>
          )
        },
        renderFallback: ({ retry }) => (
          <LoadFailureView onRetry={retry!} justifyContent="flex-end" />
        ),
      })}
    />
  )
}
