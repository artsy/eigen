import { CheckmarkFillIcon, CloseFillIcon } from "@artsy/icons/native"
import { Flex, FlexProps, Text } from "@artsy/palette-mobile"
import { ArtworkAuctionBidInfo_artwork$key } from "__generated__/ArtworkAuctionBidInfo_artwork.graphql"
import { useFragment, graphql } from "react-relay"

interface ArtworkAuctionBidInfoProps extends FlexProps {
  artwork: ArtworkAuctionBidInfo_artwork$key
}

export const ArtworkAuctionBidInfo: React.FC<ArtworkAuctionBidInfoProps> = ({
  artwork,
  ...flexProps
}) => {
  const data = useFragment(artworkAuctionBidInfoFragment, artwork)
  const { counts, currentBid } = data.saleArtwork ?? {}
  const bidsCount = counts?.bidderPositions ?? 0
  const myLotStanding = data.myLotStanding?.[0]
  const myBidPresent = !!myLotStanding?.mostRecentBid
  const label = bidsCount > 0 ? "Current bid" : "Starting bid"

  const renderBidResultIcon = () => {
    if (!myBidPresent) {
      return null
    }

    if (myLotStanding.activeBid?.isWinning) {
      return (
        <CheckmarkFillIcon
          height="16"
          fill="green100"
          accessibilityLabel="My Bid Winning Icon"
          mr={0.5}
        />
      )
    }

    return (
      <CloseFillIcon height="16" fill="red100" accessibilityLabel="My Bid Losing Icon" mr={0.5} />
    )
  }

  if (!currentBid?.display) {
    return null
  }

  return (
    <Flex
      accessibilityLabel="Auction Bid Info"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      {...flexProps}
    >
      <Text variant="lg-display">{label}</Text>
      <Flex flexDirection="row" alignItems="center">
        {renderBidResultIcon()}
        <Text variant="lg-display">{currentBid.display}</Text>
      </Flex>
    </Flex>
  )
}

const artworkAuctionBidInfoFragment = graphql`
  fragment ArtworkAuctionBidInfo_artwork on Artwork {
    myLotStanding(live: true) {
      activeBid {
        isWinning
      }
      mostRecentBid {
        internalID
      }
    }
    saleArtwork {
      currentBid {
        display
      }
      counts {
        bidderPositions
      }
    }
  }
`
