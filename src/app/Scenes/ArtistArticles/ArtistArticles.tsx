import { ArtistArticlesResultQuery } from "__generated__/ArtistArticlesResultQuery.graphql"
import { ArtistArticles_artist$data } from "__generated__/ArtistArticles_artist.graphql"
import { ArticlesList, ArticlesPlaceholder } from "app/Scenes/Articles/ArticlesList"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useState } from "react"
import {
  createPaginationContainer,
  QueryRenderer,
  RelayPaginationProp,
  graphql,
  Environment,
} from "react-relay"

const PAGE_SIZE = 10

interface ArticlesProps {
  artist: ArtistArticles_artist$data
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
      hasMore={relay.hasMore}
      refreshing={refreshing}
      handleLoadMore={handleLoadMore}
      handleRefresh={handleRefresh}
    />
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
        articlesConnection(first: $count, after: $cursor, sort: PUBLISHED_AT_DESC)
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
  environment: Environment
}> = ({ artistID, environment }) => {
  return (
    <QueryRenderer<ArtistArticlesResultQuery>
      environment={environment || getRelayEnvironment()}
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
        renderPlaceholder: () => <ArticlesPlaceholder />,
      })}
    />
  )
}
