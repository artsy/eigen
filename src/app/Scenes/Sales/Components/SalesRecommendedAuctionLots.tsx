import { OwnerType } from "@artsy/cohesion"
import { SalesRecommendedAuctionLotsQuery } from "__generated__/SalesRecommendedAuctionLotsQuery.graphql"
import { RecommendedAuctionLotsRail } from "app/Scenes/HomeView/Components/RecommendedAuctionLotsRail"
import { HomeViewSectionArtworksPlaceholder } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworks"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SalesRecommendedAuctionLotsScreenQuery = graphql`
  query SalesRecommendedAuctionLotsQuery($includeBackfill: Boolean!) {
    viewer {
      ...RecommendedAuctionLotsRail_artworkConnection @arguments(includeBackfill: $includeBackfill)
    }
  }
`

export const SalesRecommendedAuctionLotsQueryRenderer = withSuspense({
  Component: () => {
    const { variant } = useExperimentVariant("onyx_auctions_hub")
    const includeBackfill = !(variant && variant.enabled && variant.name === "experiment")

    const data = useLazyLoadQuery<SalesRecommendedAuctionLotsQuery>(
      SalesRecommendedAuctionLotsScreenQuery,
      { includeBackfill },
      { fetchPolicy: "store-and-network" }
    )

    if (!data.viewer) {
      return null
    }

    return (
      <RecommendedAuctionLotsRail
        title="Your Auction Picks"
        artworkConnection={data.viewer}
        contextScreenOwnerType={OwnerType.auctions}
      />
    )
  },
  LoadingFallback: HomeViewSectionArtworksPlaceholder,
  ErrorFallback: ({ error }) => {
    if (__DEV__) {
      console.error("LOGD [SalesRecommendedAuctionLots] Query Error:", error)
    }
    return null
  },
})
