import { ExploreByCategoryQuery } from "__generated__/ExploreByCategoryQuery.graphql"
import { ExploreByCategoryCards } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCards"
import { ExploreByCategoryCardsPlaceholder } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCardsPlaceholder"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ExploreByCategory: React.FC = memo(
  withSuspense({
    Component: () => {
      const data = useLazyLoadQuery<ExploreByCategoryQuery>(exploreByCategoryQuery, {})

      if (!data?.categories) {
        return null
      }

      return <ExploreByCategoryCards categories={data.categories} />
    },
    LoadingFallback: ExploreByCategoryCardsPlaceholder,
    ErrorFallback: NoFallback,
  })
)

export const exploreByCategoryQuery = graphql`
  query ExploreByCategoryQuery @cacheable {
    categories: discoveryCategoriesConnection {
      ...ExploreByCategoryCards_category
    }
  }
`
