import { ContextModule } from "@artsy/cohesion"
import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { CityArticlesQuery } from "__generated__/CityArticlesQuery.graphql"
import { CityGuideArticle_articles$key } from "__generated__/CityGuideArticle_articles.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
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
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface Props {
  citySlug: string
}

const CityArticles: React.FC<Props> = ({ citySlug }) => {
  const enableArticlesForYou = useFeatureFlag("AREnableCityGuideArticlesForYou")
  const data = useLazyLoadQuery<CityArticlesQuery>(Query, { citySlug, enableArticlesForYou })
  const attachments = useFragment<CityGuideArticle_articles$key>(
    cityGuideArticleFragment,
    data.city?.cityArticles ?? NO_CITY_ARTICLES
  )
  // Same order as the home section: every curated article, then the recommendations.
  const items = [
    ...toArticleRows(attachments).map((row) => ({
      key: row.id,
      article: row.article,
      contextModule: undefined,
    })),
    ...extractNodes(data.city?.recommendedArticlesConnection).map((article) => ({
      key: article.internalID,
      article,
      contextModule: ContextModule.relatedArticles,
    })),
  ]

  return (
    <Screen>
      <Screen.Header onBack={goBack} />

      <Screen.Body fullwidth>
        <Flex px={2} pb={2}>
          <Text variant="lg-display">Artsy Editorial</Text>
        </Flex>

        <Screen.FlatList
          data={items}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <Flex height={20} />}
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
  query CityArticlesQuery($citySlug: String!, $enableArticlesForYou: Boolean!)
  @relay_test_operation {
    city(slug: $citySlug) {
      cityArticles {
        ...CityGuideArticle_articles
      }
      # Metaphysics caps the pool at 10 artists × 3 articles, so this is everything it has.
      recommendedArticlesConnection(first: 30) @include(if: $enableArticlesForYou) {
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
