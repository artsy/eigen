import { DiscoverSomethingNewQuery } from "__generated__/DiscoverSomethingNewQuery.graphql"
import { DiscoverSomethingNewChips } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChips"
import { DiscoverSomethingNewChipsPlaceholder } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChipsPlaceholder"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const DiscoverSomethingNew: React.FC = memo(
  withSuspense({
    Component: () => {
      const data = useLazyLoadQuery<DiscoverSomethingNewQuery>(discoverSomethingNewQuery, {})

      if (!data?.collections) {
        return null
      }

      return <DiscoverSomethingNewChips collections={data.collections} />
    },
    LoadingFallback: DiscoverSomethingNewChipsPlaceholder,
    ErrorFallback: NoFallback,
  })
)

export const discoverSomethingNewQuery = graphql`
  query DiscoverSomethingNewQuery @cacheable {
    collections: discoveryMarketingCollections {
      ...DiscoverSomethingNewChips_collection
    }
  }
`
