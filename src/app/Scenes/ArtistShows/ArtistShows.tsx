import { Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { ArtistShowsQuery } from "__generated__/ArtistShowsQuery.graphql"
import { ArtistShows_artist$data } from "__generated__/ArtistShows_artist.graphql"
import { ArtistShow } from "app/Components/Artist/ArtistShows/ArtistShow"
import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useElasticOverscroll } from "app/utils/useElasticOverscroll"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import React, { useState } from "react"
import { Animated, StyleSheet, View, ViewStyle } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

interface Props {
  artist: ArtistShows_artist$data
  relay: RelayPaginationProp
}

const ArtistShows: React.FC<Props> = ({ artist, relay }) => {
  const top = 60
  const [isFetchingMoreData, setIsFetchingMoreData] = useState(false)
  const pastShows = extractNodes(artist.pastShows)

  const { headerElement, scrollProps, scrollAnim } = useStickyScrollHeader({
    headerText: `${artist.name} – Past Shows`,
    fadeInStart: 50,
  })
  const view = (
    <View>
      <Text variant="sm" ml="2px" mb={0.5}>
        {artist.name}
      </Text>
      <Text variant="lg-display" mb={2}>
        Past Shows
      </Text>
    </View>
  )
  const { header } = useElasticOverscroll(view, scrollAnim)

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

  const imageDimensions = { height: 82, width: 82 }

  return (
    <>
      <Animated.FlatList
        data={pastShows}
        ListHeaderComponent={() => header}
        renderItem={({ item, index }) => (
          <ArtistShow
            show={item}
            styles={showStyles}
            imageDimensions={imageDimensions}
            index={index}
          />
        )}
        keyExtractor={({ id }) => id}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Spacer y={2} />}
        contentContainerStyle={{ paddingTop: top, paddingBottom: 20, paddingHorizontal: 20 }}
        ListFooterComponent={() =>
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
  imageMargin: {
    marginRight: 15,
  },
}) as {
  container: ViewStyle
  imageMargin: ViewStyle
}

export const ArtistShowsPaginationContainer = createPaginationContainer(
  ArtistShows,
  {
    artist: graphql`
      fragment ArtistShows_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        status: { type: "String", defaultValue: "closed" }
        cursor: { type: "String" }
      ) {
        slug
        name
        pastShows: showsConnection(status: $status, first: $count, after: $cursor)
          @connection(key: "ArtistShows_pastShows") {
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
      query ArtistShowsPastShowsQuery(
        $count: Int!
        $cursor: String
        $artistID: String!
        $status: String!
      ) {
        artist(id: $artistID) {
          ...ArtistShows_artist @arguments(count: $count, cursor: $cursor, status: $status)
        }
      }
    `,
  }
)

export const ArtistShowsScreenQuery = graphql`
  query ArtistShowsQuery($artistID: String!) {
    artist(id: $artistID) {
      ...ArtistShows_artist @arguments(count: 10, status: "closed")
    }
  }
`

export const ArtistShowsQueryRenderer: React.FC<{ artistID: string }> = ({ artistID }) => {
  return (
    <QueryRenderer<ArtistShowsQuery>
      environment={getRelayEnvironment()}
      query={ArtistShowsScreenQuery}
      render={renderWithPlaceholder({
        Container: ArtistShowsPaginationContainer,
        renderPlaceholder: LoadingSkeleton,
      })}
      variables={{ artistID }}
    />
  )
}

const LoadingSkeleton = () => {
  const shows = []
  for (let i = 0; i < 6; i++) {
    shows.push(
      <Flex flexDirection="row" justifyContent="flex-start" mb={2} key={i}>
        <PlaceholderBox width={82} height={82} marginRight={15} />
        <Flex>
          <PlaceholderBox width={80 + Math.round(Math.random() * 80)} height={15} />
          <Spacer y={0.5} />
          <PlaceholderBox width={200 + Math.round(Math.random() * 100)} height={15} />
          <Spacer y={0.5} />
          <PlaceholderBox width={60 + Math.round(Math.random() * 60)} height={15} />
          <Spacer y={0.5} />
          <PlaceholderBox width={100 + Math.round(Math.random() * 100)} height={15} />
        </Flex>
      </Flex>
    )
  }
  return (
    <Flex mx={2}>
      <Spacer y="70px" />

      {/* Artist name */}
      <PlaceholderBox width={100} height={15} />
      <Spacer y={0.5} />
      {/* "Past Shows" */}
      <PlaceholderBox width={120} height={30} />
      <Spacer y={2} />
      {shows}
    </Flex>
  )
}
