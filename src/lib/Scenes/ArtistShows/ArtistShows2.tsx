import { ArtistShows2_artist } from "__generated__/ArtistShows2_artist.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { useStickyScrollHeader } from "lib/utils/useStickyScrollHeader"
import { Flex, Spacer, Spinner, Text } from "palette"
import React, { useState } from "react"
import { Animated, FlatList, RefreshControl, StyleSheet, ViewStyle } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { ArtistShows2Query } from "../../../__generated__/ArtistShows2Query.graphql"
import { ArtistShowFragmentContainer } from "../../Components/Artist/ArtistShows/ArtistShow"

interface Props {
  artist: ArtistShows2_artist
  relay: RelayPaginationProp
}

const ArtistShows2: React.FC<Props> = ({ artist, relay }) => {
  const top = useScreenDimensions().safeAreaInsets.top + 20
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFetchingMoreData, setIsFetchingMoreData] = useState(false)
  const pastShows = extractNodes(artist.pastShows)

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex backgroundColor="white">
        <FancyModalHeader>
          <Flex flex={1} pt={0.5} flexDirection="row">
            <Text variant="subtitle" numberOfLines={1} style={{ flexShrink: 1 }}>
              {artist.name} – Past Shows
            </Text>
          </Flex>
        </FancyModalHeader>
      </Flex>
    ),
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setIsRefreshing(false)
    })
  }

  const loadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setIsFetchingMoreData(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setIsFetchingMoreData(false)
    })
  }

  return (
    <>
      <Animated.FlatList
        data={pastShows}
        ListHeaderComponent={() => {
          return (
            <>
              <Text variant="mediumText" ml="2px" mb={0.5}>
                {artist.name}
              </Text>
              <Text variant="largeTitle" mb={2}>
                Past Shows
              </Text>
            </>
          )
        }}
        renderItem={({ item }) => <ArtistShowFragmentContainer show={item} styles={showStyles} />}
        keyExtractor={({ id }) => id}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Spacer height={20} />}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ paddingTop: top, paddingBottom: 20, paddingHorizontal: 20 }}
        ListFooterComponent={
          isFetchingMoreData ? (
            <Flex my={2} alignItems="center" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        onEndReached={loadMore}
        {...scrollProps}
      />
      {headerElement}
    </>
  )
}

const showStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 82,
    height: 82,
    marginRight: 15,
  },
}) as {
  container: ViewStyle
  image: ViewStyle
}

export const ArtistShows2PaginationContainer = createPaginationContainer(
  ArtistShows2,
  {
    artist: graphql`
      fragment ArtistShows2_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        status: { type: "String", defaultValue: "closed" }
        cursor: { type: "String" }
        artistID: { type: "String!" }
      ) {
        slug
        name
        pastShows: showsConnection(status: $status, first: $count, after: $cursor)
          @connection(key: "ArtistShows2_pastShows") {
          edges {
            node {
              id
              ...ArtistShow_show
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.artist.pastShows
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        artistID: props.artist.slug,
        status: "closed",
        count,
        cursor,
      }
    },

    query: graphql`
      # Here is the query to fetch any specific page
      query ArtistShows2PastShowsQuery($count: Int!, $cursor: String, $artistID: String!, $status: String!) {
        artist(id: $artistID) {
          ...ArtistShows2_artist @arguments(count: $count, cursor: $cursor, artistID: $artistID, status: $status)
        }
      }
    `,
  }
)

export const ArtistShows2QueryRenderer: React.FC<{ artistID: string }> = ({ artistID }) => {
  return (
    <QueryRenderer<ArtistShows2Query>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistShows2Query($artistID: String!) {
          artist(id: $artistID) {
            slug
            ...ArtistShows2_artist @arguments(artistID: $artistID)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ArtistShows2PaginationContainer,
        renderPlaceholder: () => <Text variant="largeTitle">Placeholder</Text>,
      })}
      variables={{ artistID }}
    />
  )
}
