import { FlexProps } from "@artsy/palette-mobile"
import { DiscoverSomethingNewQuery } from "__generated__/DiscoverSomethingNewQuery.graphql"
import { DiscoverSomethingNewChips } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChips"
import { DiscoverSomethingNewChipsPlaceholder } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChipsPlaceholder"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const DiscoverSomethingNew: React.FC<FlexProps> = memo(
  withSuspense({
    Component: ({ ...flexProps }) => {
      const data = useLazyLoadQuery<DiscoverSomethingNewQuery>(query, {})

      if (!data?.collections) {
        return null
      }

      return <DiscoverSomethingNewChips collections={data.collections} {...flexProps} />
    },
    LoadingFallback: DiscoverSomethingNewChipsPlaceholder,
    ErrorFallback: NoFallback,
  })
)

const query = graphql`
  query DiscoverSomethingNewQuery {
    collections: marketingCollections(
      slugs: [
        "most-loved"
        "understated"
        "art-gifts-under-1000-dollars"
        "transcendent"
        "best-bids"
        "statement-pieces"
        "little-gems"
        "feast-for-the-eyes"
        "street-art-edit"
        "icons"
        "bleeding-edge"
        "flora-and-fauna"
      ]
      size: 12
    ) {
      ...DiscoverSomethingNewChips_collection
    }
  }
`
