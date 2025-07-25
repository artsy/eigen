import { CheckmarkFillIcon, CloseFillIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { LotCurrentBidInfo_artwork$key } from "__generated__/LotCurrentBidInfo_artwork.graphql"
import { graphql, useFragment } from "react-relay"

interface LotCurrentBidInfoProps {
  artwork: LotCurrentBidInfo_artwork$key
}

export const LotCurrentBidInfo: React.FC<LotCurrentBidInfoProps> = ({ artwork }) => {
  const data = useFragment(lotCurrentBidInfoFragment, artwork)
  const { saleArtwork } = data
  const { reserveMessage, counts, currentBid } = saleArtwork ?? {}
  const bidsCount = counts?.bidderPositions ?? 0
  const bidText = getBidText(bidsCount, reserveMessage ?? "")
  const myLotStanding = data.myLotStanding?.[0]
  const myBidPresent = !!myLotStanding?.mostRecentBid
  const myMaxBid = myLotStanding?.mostRecentBid?.maxBid?.display

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

  return (
    <>
      <Text variant="sm">{bidText}</Text>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center">
          {renderBidResultIcon()}

          <Text variant="sm-display" fontWeight="bold">
            {currentBid?.display}
          </Text>
        </Flex>

        {!!myMaxBid && <Text variant="sm-display">Your max: {myMaxBid}</Text>}
      </Flex>
    </>
  )
}

const lotCurrentBidInfoFragment = graphql`
  fragment LotCurrentBidInfo_artwork on Artwork {
    myLotStanding(live: true) {
      activeBid {
        isWinning
      }
      mostRecentBid {
        maxBid {
          display
        }
      }
    }
    saleArtwork {
      reserveMessage
      currentBid {
        display
      }
      counts {
        bidderPositions
      }
    }
  }
`

const getBidStateText = (bidsCount: number, message: string) => {
  const textParts = []

  if (bidsCount > 0) {
    const label = bidsCount === 1 ? "1 bid" : `${bidsCount} bids`
    textParts.push(label)
  }

  if (message.length > 0) {
    textParts.push(message.toLocaleLowerCase())
  }

  return textParts.join(", ")
}

const getBidText = (bidsCount: number, reserveMessage: string) => {
  const bidsPresent = bidsCount > 0
  const bidStateText = getBidStateText(bidsCount, reserveMessage)
  const bidStatusText = bidsPresent ? "Current bid" : "Starting bid"

  if (bidStateText) {
    return `${bidStatusText} (${bidStateText})`
  }

  return bidStatusText
}
