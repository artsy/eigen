import { ArtistArticles_artist } from "__generated__/ArtistArticles_artist.graphql"
import { ArtistArticlesResultQuery } from "__generated__/ArtistArticlesResultQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, RandomWidthPlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import _ from "lodash"
import { Flex, Separator, Spacer } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, QueryRenderer, RelayPaginationProp } from "react-relay"
import { graphql } from "relay-runtime"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArticlesList, ArticlesListItem } from "../Articles/ArticlesList"

const PAGE_SIZE = 10

interface ArticlesProps {
  artist: ArtistArticles_artist
  relay: RelayPaginationProp
}

export const ArtistArticles: React.FC<ArticlesProps> = ({ artist, relay }) => {
  const articles = extractNodes(artist.articlesConnection)

  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error("Failure fetching Artist Articles ", error.message)
      }
    })
  }
  const handleRefresh = () => {
    setRefreshing(true)
    relay.refetchConnection(PAGE_SIZE)
    setRefreshing(false)
  }

  return (
    <ArticlesList
      articles={articles as any}
      isLoading={relay.isLoading}
      title={artist.name + " articles"}
      hasMore={relay.hasMore}
      refreshing={refreshing}
      handleLoadMore={handleLoadMore}
      handleRefresh={handleRefresh}
    />
  )
}

export const ArticlesPlaceholder = () => {
  const numColumns = 1

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
      <Separator />
      <FlatList
        numColumns={numColumns}
        key={`${numColumns}`}
        data={_.times(6)}
        keyExtractor={(item) => `${item}-${numColumns}`}
        renderItem={({ item }) => {
          return (
            <ArticlesListItem index={item} key={item}>
              <PlaceholderBox aspectRatio={1.33} width="100%" marginBottom={10} />
              <RandomWidthPlaceholderText minWidth={50} maxWidth={100} marginTop={1} />
              <RandomWidthPlaceholderText height={18} minWidth={200} maxWidth={200} marginTop={1} />
              <RandomWidthPlaceholderText minWidth={100} maxWidth={100} marginTop={1} />
              <Spacer mb={2} />
            </ArticlesListItem>
          )
        }}
        ItemSeparatorComponent={() => <Spacer mt="3" />}
        onEndReachedThreshold={1}
      />
    </Flex>
  )
}

export const ArtistArticlesContainer = createPaginationContainer(
  ArtistArticles,
  {
    artist: graphql`
      fragment ArtistArticles_artist on Artist
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        internalID
        name
        articlesConnection(first: $count, after: $cursor, sort: PUBLISHED_AT_DESC, inEditorialFeed: true)
          @connection(key: "ArtistArticles_articlesConnection") {
          edges {
            cursor
            node {
              internalID
              slug
              ...ArticleCard_article
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ artist }) => artist.articlesConnection,
    getVariables: (__, { count, cursor }, _fragmentVariables) => ({
      ..._fragmentVariables,
      count,
      cursor,
    }),
    query: graphql`
      query ArtistArticlesQuery($artistID: String!, $count: Int, $cursor: String) {
        artist(id: $artistID) @principalField {
          ...ArtistArticles_artist @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const ArtistArticlesQueryRenderer: React.FC<{
  artistID: string
  environment: RelayModernEnvironment
}> = ({ artistID, environment }) => {
  return (
    <QueryRenderer<ArtistArticlesResultQuery>
      environment={environment || defaultEnvironment}
      query={graphql`
        query ArtistArticlesResultQuery($artistID: String!) {
          artist(id: $artistID) {
            ...ArtistArticles_artist
          }
        }
      `}
      variables={{
        artistID,
      }}
      render={renderWithPlaceholder({
        Container: ArtistArticlesContainer,
        renderPlaceholder: ArticlesPlaceholder,
      })}
    />
  )
}
