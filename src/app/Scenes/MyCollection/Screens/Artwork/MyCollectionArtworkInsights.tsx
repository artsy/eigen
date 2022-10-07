import { MyCollectionArtworkInsights_artwork$key } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights$key } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { MyCollectionArtworkInsights_me$key } from "__generated__/MyCollectionArtworkInsights_me.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, Spacer } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworkArtistAuctionResults } from "./Components/ArtworkInsights/MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarket } from "./Components/ArtworkInsights/MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkComparableWorks } from "./Components/ArtworkInsights/MyCollectionArtworkComparableWorks"
import { MyCollectionArtworkDemandIndex } from "./Components/ArtworkInsights/MyCollectionArtworkDemandIndex"
import { RequestForPriceEstimateBanner } from "./Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateBanner"
import { MyCollectionWhySell } from "./Components/MyCollectionWhySell"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork$key
  marketPriceInsights: MyCollectionArtworkInsights_marketPriceInsights$key | null
  me: MyCollectionArtworkInsights_me$key | null
}

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = ({
  ...restProps
}) => {
  const artwork = useFragment(artworkFragment, restProps.artwork)

  const marketPriceInsights = useFragment(
    marketPriceInsightsFragment,
    restProps.marketPriceInsights
  )

  const me = useFragment(meFragment, restProps.me)

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isAlreadySubmitted = artwork.consignmentSubmission?.displayText
  const isHighDemand = Number((marketPriceInsights?.demandRank ?? 0) * 10) >= 9

  const showPriceEstimateBanner =
    useFeatureFlag("ARShowRequestPriceEstimateBanner") &&
    isP1Artist &&
    isHighDemand &&
    !isAlreadySubmitted

  return (
    <StickyTabPageScrollView>
      <Flex my={3}>
        {!!marketPriceInsights && (
          <>
            <MyCollectionArtworkDemandIndex
              artwork={artwork}
              marketPriceInsights={marketPriceInsights}
            />
            {!showPriceEstimateBanner && <Spacer p={1} />}
          </>
        )}

        {!!showPriceEstimateBanner && (
          <>
            <RequestForPriceEstimateBanner
              me={me}
              artwork={artwork}
              marketPriceInsights={marketPriceInsights}
            />
            <Spacer p={2} />
          </>
        )}

        {!!artwork.marketPriceInsights && (
          <MyCollectionArtworkArtistMarket
            artwork={artwork}
            marketPriceInsights={artwork.marketPriceInsights}
          />
        )}

        <MyCollectionArtworkComparableWorks artwork={artwork} />

        <MyCollectionArtworkArtistAuctionResults artwork={artwork} />

        {!!isP1Artist && <MyCollectionWhySell artwork={artwork} contextModule="insights" />}
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
        isP1
      }
    }
    consignmentSubmission {
      displayText
    }
    ...RequestForPriceEstimateBanner_artwork
    ...MyCollectionArtworkDemandIndex_artwork
    ...MyCollectionArtworkArtistMarket_artwork
    ...MyCollectionArtworkComparableWorks_artwork
    ...MyCollectionArtworkArtistAuctionResults_artwork
    ...MyCollectionWhySell_artwork
    marketPriceInsights {
      ...MyCollectionArtworkArtistMarket_artworkPriceInsights
    }
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
    demandRank
    ...MyCollectionArtworkDemandIndex_marketPriceInsights
    ...RequestForPriceEstimateBanner_marketPriceInsights
  }
`

const meFragment = graphql`
  fragment MyCollectionArtworkInsights_me on Me {
    ...RequestForPriceEstimateBanner_me
  }
`
