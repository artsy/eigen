import { Box, Separator } from "@artsy/palette-mobile"
import { ArtworkCommercialButtons_me$key } from "__generated__/ArtworkCommercialButtons_me.graphql"
import { ArtworkStickyBottomContent_artwork$key } from "__generated__/ArtworkStickyBottomContent_artwork.graphql"
import { ArtworkStickyBottomContent_partnerOffer$key } from "__generated__/ArtworkStickyBottomContent_partnerOffer.graphql"
import { BidButton_me$key } from "__generated__/BidButton_me.graphql"
import { MyProfileEditModal_me$key } from "__generated__/MyProfileEditModal_me.graphql"
import { useSendInquiry_me$key } from "__generated__/useSendInquiry_me.graphql"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { useScreenDimensions } from "app/utils/hooks"
import { DateTime } from "luxon"
import { useEffect } from "react"
import { graphql, useFragment } from "react-relay"
import { ArtworkCommercialButtons } from "./ArtworkCommercialButtons"
import { ArtworkPrice } from "./ArtworkPrice"

interface ArtworkStickyBottomContentProps {
  artwork: ArtworkStickyBottomContent_artwork$key
  me: ArtworkCommercialButtons_me$key &
    MyProfileEditModal_me$key &
    useSendInquiry_me$key &
    BidButton_me$key
  partnerOffer: ArtworkStickyBottomContent_partnerOffer$key
}

export const ArtworkStickyBottomContent: React.FC<ArtworkStickyBottomContentProps> = ({
  artwork,
  me,
  partnerOffer,
}) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const partnerOfferData = useFragment(partnerOfferFragment, partnerOffer)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const { safeAreaInsets } = useScreenDimensions()

  const { bottom: bottomSafeAreaInset } = useScreenDimensions().safeAreaInsets

  const setToastBottomPadding = ArtworkListsStore.useStoreActions(
    (actions) => actions.setToastBottomPadding
  )

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
      setToastBottomPadding(0)
    }
  }, [])

  if (hideContent) {
    return null
  }

  return (
    <Box
      accessibilityLabel="Sticky bottom commercial section"
      bg="mono0"
      pb={`${safeAreaInsets.bottom}px`}
      onLayout={(e) => {
        setToastBottomPadding(e.nativeEvent.layout.height - bottomSafeAreaInset)
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
