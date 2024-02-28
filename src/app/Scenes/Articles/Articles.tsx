import { Screen } from "@artsy/palette-mobile"
import { ArticleSorts, ArticlesQuery } from "__generated__/ArticlesQuery.graphql"
import { Articles_articlesConnection$key } from "__generated__/Articles_articlesConnection.graphql"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import React, { Suspense, useState } from "react"
import { useLazyLoadQuery, usePaginationFragment, graphql } from "react-relay"
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
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="Artsy Editorial" />
      <Screen.StickySubHeader title="Artsy Editorial" />
      <Screen.Body fullwidth>
        <ArticlesList
          articles={articles as any}
          isLoading={() => isLoadingNext}
          hasMore={() => hasNext}
          refreshing={refreshing}
          handleLoadMore={handleLoadMore}
          handleRefresh={handleRefresh}
        />
      </Screen.Body>
    </Screen>
  )
}

export const ArticlesScreen: React.FC = () => {
  return (
    <Suspense fallback={<ArticlesPlaceholder />}>
      <Articles />
    </Suspense>
  )
}

export const ArticlesScreenQuery = graphql`
  query ArticlesQuery($count: Int, $after: String, $sort: ArticleSorts, $featured: Boolean) {
    ...Articles_articlesConnection
      @arguments(count: $count, after: $after, sort: $sort, featured: $featured)
  }
`

export const articlesQueryVariables = {
  count: 10,
  sort: "PUBLISHED_AT_DESC" as ArticleSorts,
  featured: true,
}

const articlesConnectionFragment = graphql`
  fragment Articles_articlesConnection on Query
  @refetchable(queryName: "Articles_articlesConnectionRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    sort: { type: "ArticleSorts" }
    featured: { type: "Boolean" }
  ) {
    articlesConnection(first: $count, after: $after, sort: $sort, featured: $featured)
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
