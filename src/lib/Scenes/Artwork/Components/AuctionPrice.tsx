import { CheckCircleIcon, CloseCircleIcon, Flex, Sans, Spacer } from "@artsy/palette"
import { AuctionPrice_artwork } from "__generated__/AuctionPrice_artwork.graphql"
import { get } from "lib/utils/get"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface AuctionPriceProps {
  artwork: AuctionPrice_artwork
}

export class AuctionPrice extends React.Component<AuctionPriceProps> {
  handleBuyersPremiumTap = () => {
    return null
  }

  render() {
    const { artwork } = this.props
    const { sale, saleArtwork } = artwork

    if (!saleArtwork) {
      return null
    }

    const myLotStanding = artwork.myLotStanding && artwork.myLotStanding[0]
    const myBidPresent = !!(myLotStanding && myLotStanding.mostRecentBid)
    const myBidWinning = myBidPresent && get(myLotStanding, s => s.activeBid.isWinning)
    const myMostRecent = myBidPresent && myLotStanding.mostRecentBid
    const myMaxBid = get(myMostRecent, bid => bid.maxBid.display)
    const bidsCount = get(artwork, a => a.saleArtwork.counts.bidderPositions)
    const bidsPresent = bidsCount > 0

    const bidTextParts = []
    let reserveMessage = artwork.saleArtwork.reserveMessage
    if (bidsPresent) {
      bidTextParts.push(bidsCount === 1 ? "1 bid" : bidsCount + " bids")
      if (reserveMessage) {
        reserveMessage = reserveMessage.toLocaleLowerCase()
      }
    }
    if (reserveMessage) {
      reserveMessage = reserveMessage + "."
      bidTextParts.push(reserveMessage)
    }
    const bidText = bidTextParts.join(", ")

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
          <Sans size="2" pr={1}>
            {bidText}
          </Sans>
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
              This work has a{" "}
              <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleBuyersPremiumTap()}>
                buyer's premium
              </Text>
              .
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
      slug
      sale {
        isWithBuyersPremium
      }
      saleArtwork {
        isWithReserve
        reserveMessage
        reserveStatus
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
