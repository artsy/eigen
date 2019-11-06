import { CheckCircleIcon, CloseCircleIcon, Flex, Sans, Spacer } from "@artsy/palette"
import { AuctionPrice_artwork } from "__generated__/AuctionPrice_artwork.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { get } from "lib/utils/get"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface AuctionPriceProps {
  artwork: AuctionPrice_artwork
  auctionState: AuctionTimerState
}

export class AuctionPrice extends React.Component<AuctionPriceProps> {
  handleBuyersPremiumTap = () => {
    const auctionInternalID = this.props.artwork && this.props.artwork.sale && this.props.artwork.sale.internalID
    if (auctionInternalID) {
      SwitchBoard.presentModalViewController(this, `/auction/${auctionInternalID}/buyers-premium`)
    }
  }

  bidText = (bidsPresent, bidsCount) => {
    const { artwork } = this.props
    const bidTextParts = []
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
        <Sans size="4t" weight="medium" color="black100">
          Bidding closed
        </Sans>
      )
    } else if (!saleArtwork || !saleArtwork.currentBid) {
      // Don't display anything if there is no starting bid info
      return null
    }

    const myLotStanding = artwork.myLotStanding && artwork.myLotStanding[0]
    const myBidPresent = !!(myLotStanding && myLotStanding.mostRecentBid)
    const myBidWinning = myBidPresent && get(myLotStanding, s => s.activeBid.isWinning)
    const myMostRecent = myBidPresent && myLotStanding.mostRecentBid
    const myMaxBid = get(myMostRecent, bid => bid.maxBid.display)
    const bidsCount = get(artwork, a => a.saleArtwork.counts.bidderPositions)
    const bidsPresent = bidsCount > 0
    const bidText = this.bidText(bidsPresent, bidsCount) ? this.bidText(bidsPresent, bidsCount) : null

    return (
      <>
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          <Sans size="4t" weight="medium">
            {bidsPresent ? "Current bid" : "Starting bid"}
          </Sans>
          <Sans size="4t" weight="medium">
            {myBidPresent && (
              <Text>
                {myBidWinning ? (
                  <CheckCircleIcon height="16" fill="green100" />
                ) : (
                  <CloseCircleIcon height="16" fill="red100" />
                )}{" "}
              </Text>
            )}
            {saleArtwork.currentBid && saleArtwork.currentBid.display}
          </Sans>
        </Flex>
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          {bidText && (
            <Sans size="2" pr={1} color="black60">
              {bidText}
            </Sans>
          )}

          {myMaxBid && (
            <Sans size="2" color="black60" pl={1}>
              Your max: {myMaxBid}
            </Sans>
          )}
        </Flex>
        {sale.isWithBuyersPremium && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black60">
              This auction has a{" "}
              <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleBuyersPremiumTap()}>
                buyer's premium
              </Text>
              .{"\n"}
              Shipping, taxes, and additional fees may apply.
            </Sans>
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
