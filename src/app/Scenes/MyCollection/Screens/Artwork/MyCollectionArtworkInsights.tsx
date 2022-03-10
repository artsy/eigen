import { MyCollectionArtworkInsights_artwork$key } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights$key } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, Spacer, Text } from "palette/elements"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { showSubmitToSell } from "../../utils/checkIfSHouldShowSell"
import { MyCollectionArtworkArtistAuctionResults } from "./Components/ArtworkInsights/MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarket } from "./Components/ArtworkInsights/MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkComparableWorks } from "./Components/ArtworkInsights/MyCollectionArtworkComparableWorks"
import { MyCollectionArtworkDemandIndex } from "./Components/ArtworkInsights/MyCollectionArtworkDemandIndex"
import { RequestForPriceEstimate } from "./Components/ArtworkInsights/RequestForPriceEstimate"
import { MyCollectionWhySell } from "./Components/MyCollectionWhySell"
import { SubmitToSell } from "./Components/SubmitToSell"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork$key
  marketPriceInsights: MyCollectionArtworkInsights_marketPriceInsights$key | null
}

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = ({
  ...restProps
}) => {
  const artwork = useFragment<MyCollectionArtworkInsights_artwork$key>(
    artworkFragment,
    restProps.artwork
  )

  const marketPriceInsights = useFragment<MyCollectionArtworkInsights_marketPriceInsights$key>(
    marketPriceInsightsFragment,
    restProps.marketPriceInsights
  )

  const isPOneArtist =
    !!artwork.artists?.find((artist) => Boolean(artist?.targetSupply?.isTargetSupply)) ??
    !!artwork.artist?.targetSupply?.isTargetSupply ??
    false

  const showPriceEstimateBanner = useFeatureFlag("ARShowRequestPriceEstimateBanner") && isPOneArtist

  return (
    <StickyTabPageScrollView>
      <Flex my={3}>
        <Text variant="lg">Price & Market Insights</Text>

        <Spacer mb={2} />

        {!!marketPriceInsights && (
          <MyCollectionArtworkDemandIndex
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
        )}
        {!!showPriceEstimateBanner && (
          <>
            <RequestForPriceEstimate artwork={artwork} marketPriceInsights={marketPriceInsights} />
            <Spacer p={2} />
          </>
        )}

        {!!marketPriceInsights && (
          <MyCollectionArtworkArtistMarket
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
        )}

        <MyCollectionArtworkComparableWorks artwork={artwork} />

        <MyCollectionArtworkArtistAuctionResults artwork={artwork} />

        {showSubmitToSell(artwork) ? <SubmitToSell /> : <MyCollectionWhySell artwork={artwork} />}
      </Flex>
    </StickyTabPageScrollView>
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
    artists {
      targetSupply {
        isTargetSupply
      }
    }
    consignmentSubmission {
      displayText
    }
    ...RequestForPriceEstimate_artwork
    ...MyCollectionArtworkDemandIndex_artwork
    ...MyCollectionArtworkArtistMarket_artwork
    ...MyCollectionArtworkComparableWorks_artwork
    ...MyCollectionArtworkArtistAuctionResults_artwork
    ...MyCollectionWhySell_artwork
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
    ...MyCollectionArtworkDemandIndex_marketPriceInsights
    ...MyCollectionArtworkArtistMarket_marketPriceInsights
    ...RequestForPriceEstimate_marketPriceInsights
  }
`
