import { Articles_articlesConnection$key } from "__generated__/Articles_articlesConnection.graphql"
import { ArticlesQuery } from "__generated__/ArticlesQuery.graphql"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, ProvidePlaceholderContext, RandomWidthPlaceholderText } from "lib/utils/placeholders"
import _ from "lodash"
import { Flex, Separator, Spacer, Text } from "palette"
import React, { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { ConnectionConfig } from "react-relay"
import { usePagination, useQuery } from "relay-hooks"
import { graphql } from "relay-runtime"
import { ArticlesList, ArticlesListItem, useNumColumns } from "./ArticlesList"

const PAGE_SIZE = 10

interface ArticlesProps {
  query: Articles_articlesConnection$key
}

export const Articles: React.FC<ArticlesProps> = (props) => {
  const [queryData, { isLoading, hasMore, loadMore, refetchConnection }] = usePagination(fragmentSpec, props.query)
  const articles = extractNodes(queryData.articlesConnection)

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

export const ArticlesQueryRenderer: React.FC = () => {
  const { props, error, retry } = useQuery<ArticlesQuery>(query, {
    count: PAGE_SIZE,
    inEditorialFeed: true,
    sort: "PUBLISHED_AT_DESC",
  })

  if (props) {
    return <Articles query={props} />
  }
  if (error) {
    console.error(error)
    return <LoadFailureView onRetry={retry} />
  }

  return <ArticlesPlaceholder />
}

export const ArticlesPlaceholder: React.FC = () => {
  const numColumns = useNumColumns()

  return (
    <ProvidePlaceholderContext>
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
    </ProvidePlaceholderContext>
  )
}

export const ArticlesHeader = () => (
  <Text mx="2" variant={"largeTitle"} mb={1} mt={6}>
    Market News
  </Text>
)

const fragmentSpec = graphql`
  fragment Articles_articlesConnection on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    sort: { type: "ArticleSorts" }
    inEditorialFeed: { type: "Boolean" }
  ) {
    articlesConnection(first: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
      @connection(key: "Articles_articlesConnection") {
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
  query ArticlesQuery($count: Int, $after: String, $sort: ArticleSorts, $inEditorialFeed: Boolean) {
    ...Articles_articlesConnection
      @arguments(count: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
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
