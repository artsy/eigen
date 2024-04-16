import { Box, Separator } from "@artsy/palette-mobile"
import { ArtworkStickyBottomContent_artwork$key } from "__generated__/ArtworkStickyBottomContent_artwork.graphql"
import { ArtworkStickyBottomContent_me$key } from "__generated__/ArtworkStickyBottomContent_me.graphql"
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
  me: ArtworkStickyBottomContent_me$key
}

export const ArtworkStickyBottomContent: React.FC<ArtworkStickyBottomContentProps> = ({
  artwork,
  me,
}) => {
  const { safeAreaInsets } = useScreenDimensions()
  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)
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
        <ArtworkPrice artwork={artworkData} me={meData} mb={1} />
        <ArtworkCommercialButtons artwork={artworkData} me={meData} />
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

const meFragment = graphql`
  fragment ArtworkStickyBottomContent_me on Me
  @argumentDefinitions(artworkID: { type: "String!" }) {
    ...ArtworkCommercialButtons_me
    ...ArtworkPrice_me @arguments(artworkID: $artworkID)
  }
`
