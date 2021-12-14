import { Articles_articlesConnection$key } from "__generated__/Articles_articlesConnection.graphql"
import { ArticlesQuery } from "__generated__/ArticlesQuery.graphql"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { extractNodes } from "lib/utils/extractNodes"
import React, { useEffect, useState } from "react"
import { ConnectionConfig } from "react-relay"
import { usePagination, useQuery } from "relay-hooks"
import { graphql } from "relay-runtime"
import { ArticlesList, ArticlesPlaceholder } from "./ArticlesList"

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
      title="Market News"
      refreshing={refreshing}
      handleLoadMore={handleLoadMore}
      handleRefresh={handleRefresh}
    />
  )
}

export const ArticlesQueryRenderer: React.FC = () => {
  const { props, error, retry } = useQuery<ArticlesQuery>(ArticlesScreenQuery, {
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

export const ArticlesScreenQuery = graphql`
  query ArticlesQuery($count: Int, $after: String, $sort: ArticleSorts, $inEditorialFeed: Boolean) {
    ...Articles_articlesConnection
      @arguments(count: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
  }
`

const connectionConfig: ConnectionConfig = {
  query: ArticlesScreenQuery,
  getVariables: (_props, { count, cursor }, _fragmentVariables) => ({
    count,
    after: cursor,
    inEditorialFeed: true,
    sort: "PUBLISHED_AT_DESC",
  }),
}
