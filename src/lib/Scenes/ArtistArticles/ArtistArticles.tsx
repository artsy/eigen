import {
  ArtistArticlesResultQuery,
  ArtistArticlesResultQueryResponse,
} from "__generated__/ArtistArticlesResultQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, ProvidePlaceholderContext, RandomWidthPlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import _ from "lodash"
import { Flex, Separator, Spacer, Text } from "palette"
import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { ConnectionConfig, QueryRenderer } from "react-relay"
import { usePagination } from "relay-hooks"
import { graphql } from "relay-runtime"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArticlesList, ArticlesListItem, useNumColumns } from "../Articles/ArticlesList"

const PAGE_SIZE = 10

interface ArticlesProps {
  artist: ArtistArticlesResultQueryResponse["artist"]
}

export const ArtistArticles: React.FC<ArticlesProps> = (props) => {
  const [queryData, { isLoading, hasMore, loadMore, refetchConnection }] = usePagination(fragmentSpec, props.query)
  // const articles = extractNodes(queryData.articlesConnection)
  const articles = extractNodes(props.artist?.articlesConnection)

  console.log("Coming....", articles)

  useEffect(() => {
    loadMore(connectionConfig, PAGE_SIZE)
  }, [])

  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = () => {
    if (!hasMore() || isLoading()) {
      return
    }
    loadMore(connectionConfig, PAGE_SIZE)
  }
  const handleRefresh = () => {
    setRefreshing(true)
    refetchConnection(connectionConfig, PAGE_SIZE)
    setRefreshing(false)
  }

  return (
    <ArticlesList
      articles={articles as any}
      isLoading={isLoading}
      hasMore={hasMore}
      refreshing={refreshing}
      handleLoadMore={handleLoadMore}
      handleRefresh={handleRefresh}
    />
  )
}

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
            id
            articlesConnection(first: 10) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `}
      variables={{
        artistID,
      }}
      render={renderWithPlaceholder({
        Container: ArtistArticles,
        renderPlaceholder: ArticlesPlaceholder,
      })}
    />
  )
}

export const ArticlesPlaceholder: React.FC = () => {
  const numColumns = useNumColumns()

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
      <Separator />
      <FlatList
        numColumns={numColumns}
        key={`${numColumns}`}
        ListHeaderComponent={() => <ArticlesHeader />}
        data={_.times(6)}
        keyExtractor={(item) => `${item}-${numColumns}`}
        renderItem={({ item }) => {
          return (
            <ArticlesListItem index={item} key={item}>
              <PlaceholderBox aspectRatio={1.33} width={"100%"} marginBottom={10} />
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

export const ArticlesHeader = () => (
  <Text mx="2" variant={"largeTitle"} mb={1} mt={6}>
    Market News
  </Text>
)

const fragmentSpec = graphql`
  fragment ArtistArticles_articlesConnection on Artist
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    sort: { type: "ArticleSorts" }
    inEditorialFeed: { type: "Boolean" }
  ) {
    articlesConnection(first: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
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
`

const query = graphql`
  query ArtistArticlesQuery($id: String!, $count: Int, $after: String, $sort: ArticleSorts, $inEditorialFeed: Boolean) {
    artist(id: $id) @principalField {
      ...ArtistArticles_articlesConnection
        @arguments(count: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
    }
  }
`

const connectionConfig: ConnectionConfig = {
  query,
  getVariables: (_props, { count, cursor }, _fragmentVariables) => ({
    count,
    after: cursor,
    inEditorialFeed: true,
    sort: "PUBLISHED_AT_DESC",
  }),
}
