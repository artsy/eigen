import { ContextModule } from "@artsy/cohesion"
import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { CityArticlesQuery } from "__generated__/CityArticlesQuery.graphql"
import { CityArticles_query$key } from "__generated__/CityArticles_query.graphql"
import { CityGuideArticleRow_article$key } from "__generated__/CityGuideArticleRow_article.graphql"
import { CityGuideArticle_articles$key } from "__generated__/CityGuideArticle_articles.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import Spinner from "app/Components/Spinner"
import { CityArticleListItem } from "app/Scenes/CityGuide/Components/CityArticleListItem"
import {
  cityGuideArticleFragment,
  NO_CITY_ARTICLES,
  toArticleRows,
} from "app/Scenes/CityGuide/utils/CityGuideArticle"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const PAGE_SIZE = 30

interface Props {
  citySlug: string
}

const CityArticles: React.FC<Props> = ({ citySlug }) => {
  const enableArticlesForYou = useFeatureFlag("AREnableCityGuideArticlesForYou")
  const queryData = useLazyLoadQuery<CityArticlesQuery>(Query, {
    citySlug,
    count: PAGE_SIZE,
    enableArticlesForYou,
  })
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CityArticlesQuery,
    CityArticles_query$key
  >(cityArticlesFragment, queryData)
  const attachments = useFragment<CityGuideArticle_articles$key>(
    cityGuideArticleFragment,
    data.city?.cityArticles ?? NO_CITY_ARTICLES
  )
  const rows = toArticleRows(attachments)

  // The connection is only requested when the flag is on. When it's there, Metaphysics has
  // already merged and sorted curated and recommended articles into one list.
  const connection = data.city?.recommendedArticlesConnection
  const curatedIds = new Set(rows.map((row) => row.articleInternalID))

  const items: {
    key: string
    article: CityGuideArticleRow_article$key
    contextModule: ContextModule | undefined
  }[] = connection
    ? extractNodes(connection).map((article) => ({
        key: article.internalID,
        article,
        contextModule: curatedIds.has(article.internalID)
          ? ContextModule.articles
          : ContextModule.relatedArticles,
      }))
    : rows.map((row) => ({
        key: row.id,
        article: row.article,
        contextModule: undefined,
      }))

  return (
    <Screen>
      <Screen.Header onBack={goBack} />

      <Screen.Body fullwidth>
        <Flex px={2} pb={2}>
          <Text variant="lg-display">Artsy Editorial</Text>
        </Flex>

        <Screen.FlatList
          testID="city-articles-list"
          data={items}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <Flex height={20} />}
          onEndReached={() => {
            if (hasNext && !isLoadingNext) {
              loadNext(PAGE_SIZE)
            }
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() =>
            isLoadingNext ? (
              <Flex my={4} flexDirection="row" justifyContent="center">
                <Spinner />
              </Flex>
            ) : null
          }
          renderItem={({ item }) => (
            <CityArticleListItem
              article={item.article}
              citySlug={citySlug}
              contextModule={item.contextModule}
            />
          )}
        />
      </Screen.Body>
    </Screen>
  )
}

const Query = graphql`
  query CityArticlesQuery($citySlug: String!, $count: Int!, $enableArticlesForYou: Boolean!)
  @relay_test_operation {
    ...CityArticles_query
      @arguments(citySlug: $citySlug, count: $count, enableArticlesForYou: $enableArticlesForYou)
  }
`

const cityArticlesFragment = graphql`
  fragment CityArticles_query on Query
  @refetchable(queryName: "CityArticlesPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 30 }
    cursor: { type: "String" }
    enableArticlesForYou: { type: "Boolean", defaultValue: false }
  ) {
    city(slug: $citySlug) {
      cityArticles {
        ...CityGuideArticle_articles
      }
      recommendedArticlesConnection(first: $count, after: $cursor, includeFeatured: true)
        @include(if: $enableArticlesForYou)
        @connection(key: "CityArticles_recommendedArticlesConnection") {
        edges {
          node {
            internalID
            ...CityGuideArticleRow_article
          }
        }
      }
    }
  }
`

export const CityArticlesScreen = withSuspense({
  Component: CityArticles,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})
