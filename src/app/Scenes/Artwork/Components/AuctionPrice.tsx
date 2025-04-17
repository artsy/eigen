import { Spacer, CloseCircleIcon, CheckCircleIcon, Flex, Text } from "@artsy/palette-mobile"
import { AuctionPrice_artwork$data } from "__generated__/AuctionPrice_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/system/navigation/navigate"
import { get } from "app/utils/get"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export interface AuctionPriceProps {
  artwork: AuctionPrice_artwork$data
  auctionState: AuctionTimerState
}

export class AuctionPrice extends React.Component<AuctionPriceProps> {
  handleBuyersPremiumTap = () => {
    const auctionInternalID =
      this.props.artwork && this.props.artwork.sale && this.props.artwork.sale.internalID
    if (auctionInternalID) {
      navigate(`/auction/${auctionInternalID}/buyers-premium`)
    }
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  bidText = (bidsPresent, bidsCount) => {
    const { artwork } = this.props
    const bidTextParts = []
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    let reserveMessage = artwork.saleArtwork.reserveMessage

    if (bidsPresent) {
      bidTextParts.push(bidsCount === 1 ? "1 bid" : bidsCount + " bids")
      if (reserveMessage) {
        reserveMessage = reserveMessage.toLocaleLowerCase()
      }
    }
    if (reserveMessage) {
      bidTextParts.push(reserveMessage)
    }
    return bidTextParts.join(", ")
  }

  render() {
    const { artwork, auctionState } = this.props
    const { sale, saleArtwork } = artwork

    if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
      // We do not have reliable Bid info for artworks in Live sales in progress
      return null
    } else if (auctionState === AuctionTimerState.CLOSED) {
      return (
        <Text variant="sm-display" weight="medium" color="mono100">
          Bidding closed
        </Text>
      )
    } else if (!saleArtwork || !saleArtwork.currentBid) {
      // Don't display anything if there is no starting bid info
      return null
    }

    const myLotStanding = artwork.myLotStanding && artwork.myLotStanding[0]
    const myBidPresent = !!(myLotStanding && myLotStanding.mostRecentBid)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const myBidWinning = myBidPresent && get(myLotStanding, (s) => s.activeBid.isWinning)
    const myMostRecent = myBidPresent && myLotStanding.mostRecentBid
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const myMaxBid = get(myMostRecent, (bid) => bid.maxBid.display)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const bidsCount = get(artwork, (a) => a.saleArtwork.counts.bidderPositions)
    const bidsPresent = bidsCount > 0
    const bidText = this.bidText(bidsPresent, bidsCount)
      ? this.bidText(bidsPresent, bidsCount)
      : null

    return (
      <>
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          <Text weight="medium">{bidsPresent ? "Current bid" : "Starting bid"}</Text>
          <Text variant="sm-display" weight="medium">
            {!!myBidPresent && (
              <Text variant="sm-display">
                {myBidWinning ? (
                  <CheckCircleIcon
                    height="16"
                    fill="green100"
                    accessibilityLabel="My Bid Winning Icon"
                  />
                ) : (
                  <CloseCircleIcon
                    height="16"
                    fill="red100"
                    accessibilityLabel="My Bid Losing Icon"
                  />
                )}{" "}
              </Text>
            )}
            {!!saleArtwork.currentBid && saleArtwork.currentBid.display}
          </Text>
        </Flex>
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          {!!bidText && (
            <Text variant="xs" pr={1} color="mono60">
              {bidText}
            </Text>
          )}

          {!!myMaxBid && (
            <Text variant="xs" color="mono60" pl={1}>
              Your max: {myMaxBid}
            </Text>
          )}
        </Flex>
        {!!sale?.isWithBuyersPremium && (
          <>
            <Spacer y={1} />
            <Text variant="sm" color="mono60">
              This auction has a{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => this.handleBuyersPremiumTap()}
              >
                buyer's premium
              </Text>
              .{"\n"}
              Shipping, taxes, and additional fees may apply.
            </Text>
          </>
        )}
      </>
    )
  }
}

export const AuctionPriceFragmentContainer = createFragmentContainer(AuctionPrice, {
  artwork: graphql`
    fragment AuctionPrice_artwork on Artwork {
      sale {
        internalID
        isWithBuyersPremium
        isClosed
        isLiveOpen
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
    }
  `,
})
