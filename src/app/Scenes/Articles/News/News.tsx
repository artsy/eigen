import { Screen } from "@artsy/palette-mobile"
import { ArticleSorts } from "__generated__/ArticlesQuery.graphql"
import { NewsQuery } from "__generated__/NewsQuery.graphql"
import { News_articlesConnection$key } from "__generated__/News_articlesConnection.graphql"
import { ArticlesList, ArticlesPlaceholder } from "app/Scenes/Articles/ArticlesList"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import React, { Suspense, useState } from "react"
import { useLazyLoadQuery, usePaginationFragment, graphql } from "react-relay"

export const News: React.FC = () => {
  const queryData = useLazyLoadQuery<NewsQuery>(NewsScreenQuery, newsArticlesQueryVariables)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    NewsQuery,
    News_articlesConnection$key
  >(newsArticlesConnectionFragment, queryData)

  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(newsArticlesQueryVariables.count)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch({})
    setRefreshing(false)
  }

  const articles = extractNodes(data.articlesConnection)

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="News" />
      <Screen.StickySubHeader title="News" />
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

export const NewsScreen: React.FC = () => (
  <Suspense fallback={<ArticlesPlaceholder title="News" />}>
    <News />
  </Suspense>
)

export const NewsScreenQuery = graphql`
  query NewsQuery($count: Int, $after: String, $sort: ArticleSorts) {
    ...News_articlesConnection @arguments(count: $count, after: $after, sort: $sort)
  }
`

export const newsArticlesQueryVariables = {
  count: 10,
  sort: "PUBLISHED_AT_DESC" as ArticleSorts,
}

const newsArticlesConnectionFragment = graphql`
  fragment News_articlesConnection on Query
  @refetchable(queryName: "News_articlesConnectionRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    sort: { type: "ArticleSorts" }
  ) {
    articlesConnection(first: $count, after: $after, sort: $sort, layout: NEWS)
      @connection(key: "News_articlesConnection") {
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
