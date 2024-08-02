import { Box, Separator } from "@artsy/palette-mobile"
import { ArtworkCommercialButtons_me$key } from "__generated__/ArtworkCommercialButtons_me.graphql"
import { ArtworkStickyBottomContent_artwork$key } from "__generated__/ArtworkStickyBottomContent_artwork.graphql"
import { ArtworkStickyBottomContent_partnerOffer$key } from "__generated__/ArtworkStickyBottomContent_partnerOffer.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { useScreenDimensions } from "app/utils/hooks"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { useFragment, graphql } from "react-relay"
import { ArtworkCommercialButtons } from "./ArtworkCommercialButtons"
import { ArtworkPrice } from "./ArtworkPrice"

interface ArtworkStickyBottomContentProps {
  artwork: ArtworkStickyBottomContent_artwork$key
  me: ArtworkCommercialButtons_me$key
  partnerOffer: ArtworkStickyBottomContent_partnerOffer$key
}

export const ArtworkStickyBottomContent: React.FC<ArtworkStickyBottomContentProps> = ({
  artwork,
  me,
  partnerOffer,
}) => {
  const { safeAreaInsets } = useScreenDimensions()
  const artworkData = useFragment(artworkFragment, artwork)
  const partnerOfferData = useFragment(partnerOfferFragment, partnerOffer)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)

  const { bottom: bottomSafeAreaInset } = useScreenDimensions().safeAreaInsets

  const { dispatch } = useArtworkListsContext()

  const checkIsLotEnded = () => {
    const endAt = artworkData.saleArtwork?.extendedBiddingEndAt ?? artworkData.saleArtwork?.endAt

    if (!endAt) {
      return false
    }

    return DateTime.now() > DateTime.fromISO(endAt)
  }

  const hideContent =
    !artworkData.isForSale ||
    artworkData.isSold ||
    auctionState === AuctionTimerState.CLOSED ||
    checkIsLotEnded()

  useEffect(() => {
    if (hideContent) {
      dispatch({
        type: "SET_TOAST_BOTTOM_PADDING",
        payload: 0,
      })
    }
  }, [])

  if (hideContent) {
    return null
  }

  return (
    <Box
      accessibilityLabel="Sticky bottom commercial section"
      bg="white100"
      pb={`${safeAreaInsets.bottom}px`}
      onLayout={(e) => {
        dispatch({
          type: "SET_TOAST_BOTTOM_PADDING",
          payload: e.nativeEvent.layout.height - bottomSafeAreaInset,
        })
      }}
    >
      <Separator />
      <Box px={2} py={1}>
        <ArtworkPrice artwork={artworkData} partnerOffer={partnerOfferData} mb={1} />
        <ArtworkCommercialButtons artwork={artworkData} partnerOffer={partnerOfferData} me={me} />
      </Box>
    </Box>
  )
}

const artworkFragment = graphql`
  fragment ArtworkStickyBottomContent_artwork on Artwork {
    isForSale
    isSold
    saleArtwork {
      endAt
      extendedBiddingEndAt
    }
    ...ArtworkPrice_artwork
    ...ArtworkCommercialButtons_artwork
  }
`

const partnerOfferFragment = graphql`
  fragment ArtworkStickyBottomContent_partnerOffer on PartnerOfferToCollector {
    internalID
    ...ArtworkPrice_partnerOffer
    ...ArtworkCommercialButtons_partnerOffer
  }
`
