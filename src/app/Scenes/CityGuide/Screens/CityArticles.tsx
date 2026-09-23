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
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface Props {
  citySlug: string
}

const CityArticles: React.FC<Props> = ({ citySlug }) => {
  const data = useLazyLoadQuery<CityArticlesQuery>(Query, { citySlug })
  const attachments = useFragment<CityGuideArticle_articles$key>(
    cityGuideArticleFragment,
    data.city?.cityArticles ?? NO_CITY_ARTICLES
  )
  const rows = toArticleRows(attachments)

  return (
    <Screen>
      <Screen.Header onBack={goBack} />

      <Screen.Body fullwidth>
        <Flex px={2} pb={2}>
          <Text variant="lg-display">Artsy Editorial</Text>
        </Flex>

        <Screen.FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <Flex height={20} />}
          renderItem={({ item }) => <CityArticleListItem item={item} citySlug={citySlug} />}
        />
      </Screen.Body>
    </Screen>
  )
}

const Query = graphql`
  query CityArticlesQuery($citySlug: String!) @relay_test_operation {
    city(slug: $citySlug) {
      cityArticles {
        ...CityGuideArticle_articles
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
