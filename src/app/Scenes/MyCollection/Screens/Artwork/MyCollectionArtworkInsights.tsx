import { Flex, Separator } from "@artsy/palette-mobile"
import { MyCollectionArtworkInsights_artwork$key } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights$key } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { MyCollectionArtworkInsights_me$key } from "__generated__/MyCollectionArtworkInsights_me.graphql"
import { PriceEstimateRequested } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/PriceEstimateRequested"
import { MyCollectionArtworkSubmissionStatus } from "app/Scenes/MyCollection/Screens/Artwork/Components/MyCollectionArtworkSubmissionStatus"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"
import { MyCollectionArtworkArtistAuctionResults } from "./Components/ArtworkInsights/MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarket } from "./Components/ArtworkInsights/MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkComparableWorks } from "./Components/ArtworkInsights/MyCollectionArtworkComparableWorks"
import { MyCollectionArtworkDemandIndex } from "./Components/ArtworkInsights/MyCollectionArtworkDemandIndex"
import { RequestForPriceEstimateBanner } from "./Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateBanner"
import { MyCollectionWhySell } from "./Components/MyCollectionWhySell"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork$key
  marketPriceInsights: MyCollectionArtworkInsights_marketPriceInsights$key | null | undefined
  me: MyCollectionArtworkInsights_me$key | null | undefined
}

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = ({
  ...restProps
}) => {
  const enableSubmitArtworkTier2Information = useFeatureFlag(
    "AREnableSubmitArtworkTier2Information"
  )

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const marketPriceInsights = useFragment(
    marketPriceInsightsFragment,
    restProps.marketPriceInsights
  )

  const me = useFragment(meFragment, restProps.me)

  const isSubmissionRejected = artwork?.consignmentSubmission?.state === "REJECTED"

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

      {!!enableSubmitArtworkTier2Information && !!isSubmissionRejected && (
        <>
          <MyCollectionArtworkSubmissionStatus artwork={artwork} />
          <Separator my={4} borderColor="black10" />
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

      <PriceEstimateRequested me={me} artwork={artwork} />

      <RequestForPriceEstimateBanner
        me={me}
        artwork={artwork}
        marketPriceInsights={marketPriceInsights}
      />

      <MyCollectionWhySell artwork={artwork} contextModule="insights" />

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
    ...MyCollectionWhySell_artwork
    marketPriceInsights {
      ...MyCollectionArtworkArtistMarket_artworkPriceInsights
      ...MyCollectionArtworkDemandIndex_artworkPriceInsights
    }
    consignmentSubmission {
      state
    }
    ...MyCollectionArtworkSubmissionStatus_submissionState
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
    demandRank
    ...RequestForPriceEstimateBanner_marketPriceInsights
  }
`

const meFragment = graphql`
  fragment MyCollectionArtworkInsights_me on Me {
    ...RequestForPriceEstimateBanner_me
  }
`
