import { Flex } from "@artsy/palette-mobile"
import { MyCollectionArtworkInsights_artwork$key } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { graphql, useFragment } from "react-relay"
import { MyCollectionArtworkArtistAuctionResults } from "./Components/ArtworkInsights/MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarket } from "./Components/ArtworkInsights/MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkComparableWorks } from "./Components/ArtworkInsights/MyCollectionArtworkComparableWorks"
import { MyCollectionArtworkDemandIndex } from "./Components/ArtworkInsights/MyCollectionArtworkDemandIndex"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork$key
}

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = ({
  ...restProps
}) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)

  return (
    <Flex mt={2} px={2}>
      {!!artwork.marketPriceInsights && (
        <>
          <MyCollectionArtworkDemandIndex
            artwork={artwork}
            marketPriceInsights={artwork.marketPriceInsights}
          />
        </>
      )}

      {!!artwork.marketPriceInsights && (
        <>
          <MyCollectionArtworkArtistMarket
            artwork={artwork}
            marketPriceInsights={artwork.marketPriceInsights}
          />
        </>
      )}

      <MyCollectionArtworkComparableWorks artwork={artwork} />

      <MyCollectionArtworkArtistAuctionResults artwork={artwork} />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkInsights_artwork on Artwork {
    id
    slug
    internalID
    artist {
      targetSupply {
        isTargetSupply
      }
    }
    ...RequestForPriceEstimateBanner_artwork
    ...MyCollectionArtworkDemandIndex_artwork
    ...MyCollectionArtworkArtistMarket_artwork
    ...MyCollectionArtworkComparableWorks_artwork
    ...MyCollectionArtworkArtistAuctionResults_artwork
    marketPriceInsights {
      ...MyCollectionArtworkArtistMarket_artworkPriceInsights
      ...MyCollectionArtworkDemandIndex_artworkPriceInsights
    }
    consignmentSubmission {
      state
    }
  }
`
