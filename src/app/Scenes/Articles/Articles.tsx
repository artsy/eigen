import { Articles_articlesConnection$key } from "__generated__/Articles_articlesConnection.graphql"
import { ArticleSorts, ArticlesQuery } from "__generated__/ArticlesQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import React, { Suspense, useState } from "react"
import { useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArticlesList, ArticlesPlaceholder } from "./ArticlesList"

export const Articles: React.FC = () => {
  const queryData = useLazyLoadQuery<ArticlesQuery>(ArticlesScreenQuery, articlesQueryVariables)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ArticlesQuery,
    Articles_articlesConnection$key
  >(articlesConnectionFragment, queryData)

  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(articlesQueryVariables.count)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch({})
    setRefreshing(false)
  }

  const articles = extractNodes(data.articlesConnection)

  return (
    <ArticlesList
      articles={articles as any}
      isLoading={() => isLoadingNext}
      hasMore={() => hasNext}
      title="Market News"
      refreshing={refreshing}
      handleLoadMore={handleLoadMore}
      handleRefresh={handleRefresh}
    />
  )
}

export const ArticlesScreen: React.FC = () => (
  <Suspense fallback={<ArticlesPlaceholder />}>
    <Articles />
  </Suspense>
)

export const ArticlesScreenQuery = graphql`
  query ArticlesQuery($count: Int, $after: String, $sort: ArticleSorts, $inEditorialFeed: Boolean) {
    ...Articles_articlesConnection
      @arguments(count: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
  }
`

export const articlesQueryVariables = {
  count: 10,
  inEditorialFeed: true,
  sort: "PUBLISHED_AT_DESC" as ArticleSorts,
}

const articlesConnectionFragment = graphql`
  fragment Articles_articlesConnection on Query
  @refetchable(queryName: "Articles_articlesConnectionRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    sort: { type: "ArticleSorts" }
    inEditorialFeed: { type: "Boolean" }
  ) {
    articlesConnection(
      first: $count
      after: $after
      sort: $sort
      inEditorialFeed: $inEditorialFeed
    ) @connection(key: "Articles_articlesConnection") {
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
