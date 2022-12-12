import { FavoriteArtworks_me$data } from "__generated__/FavoriteArtworks_me.graphql"
import { FavoriteArtworksQuery } from "__generated__/FavoriteArtworksQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { ZeroState } from "app/Components/States/ZeroState"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { FAVORITE_ARTWORKS_REFRESH_KEY, RefreshEvents } from "app/utils/refreshHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Button, Spacer, useSpace } from "palette"
import { useEffect, useState } from "react"
import { Image } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface Props {
  me: FavoriteArtworks_me$data
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

const SavedWorks: React.FC<Props> = ({ me, relay, onDataFetching }) => {
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
      <StickyTabPageScrollView
        refreshControl={
          <StickTabPageRefreshControl refreshing={refreshingFromPull} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", height: "100%" }}
      >
        <ZeroState
          bigTitle="Keep track of artworks you love"
          subtitle="Tap the heart on an artwork to find it again easily here."
          image={
            <>
              <Spacer mt={1} />
              <Image
                source={require("images/SavesEmptyStateImage.png")}
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
      </StickyTabPageScrollView>
    )
  }

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{ paddingVertical: space(2) }}
      onEndReached={loadMore}
      refreshControl={
        <StickTabPageRefreshControl refreshing={refreshingFromPull} onRefresh={handleRefresh} />
      }
    >
      <GenericGrid
        artworks={artworks}
        isLoading={fetchingMoreData}
        hidePartner
        artistNamesTextStyle={{ weight: "regular" }}
        saleInfoTextStyle={{ weight: "medium", color: "black100" }}
      />
    </StickyTabPageScrollView>
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
      environment={defaultEnvironment}
      query={FavoriteArtworksScreenQuery}
      variables={{
        count: 10,
      }}
      render={renderWithPlaceholder({
        Container: FavoriteArtworksContainer,
        renderPlaceholder: () => {
          return (
            <StickyTabPageScrollView scrollEnabled={false} style={{ paddingTop: 20 }}>
              <GenericGridPlaceholder width={screen.width - 40} />
            </StickyTabPageScrollView>
          )
        },
        renderFallback: ({ retry }) => (
          <LoadFailureView onRetry={retry!} justifyContent="flex-end" />
        ),
      })}
    />
  )
}
