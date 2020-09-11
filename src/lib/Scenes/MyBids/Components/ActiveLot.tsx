import { ActiveLot_lotStanding } from "__generated__/ActiveLot_lotStanding.graphql"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { HighestBid, Outbid, ReserveNotMet } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

export const ActiveLot = ({ lotStanding }: { lotStanding: ActiveLot_lotStanding }) => {
  const sellingPrice = lotStanding?.lotState?.sellingPrice?.displayAmount
  const bidCount = lotStanding?.lotState?.bidCount
  const { saleArtwork, lotState } = lotStanding

  return (
    saleArtwork &&
    lotState && (
      <Lot saleArtwork={saleArtwork}>
        <Flex flexDirection="row">
          <Text variant="caption">{sellingPrice}</Text>
          <Text variant="caption" color="black60">
            {" "}
            ({bidCount} {bidCount === 1 ? "bid" : "bids"})
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          {lotStanding?.isHighestBidder && lotStanding.lotState.reserveStatus === "ReserveNotMet" ? (
            <ReserveNotMet />
          ) : lotStanding?.isHighestBidder ? (
            <HighestBid />
          ) : (
            <Outbid />
          )}
        </Flex>
      </Lot>
    )
  )
}

export const ActiveLotFragmentContainer = createFragmentContainer(ActiveLot, {
  lotStanding: graphql`
    fragment ActiveLot_lotStanding on AuctionsLotStanding {
      isHighestBidder
      lotState {
        internalID
        bidCount
        reserveStatus
        soldStatus
        askingPrice: onlineAskingPrice {
          displayAmount
        }
        sellingPrice: floorSellingPrice {
          displayAmount
        }
      }
      saleArtwork {
        ...Lot_saleArtwork
      }
    }
  `,
})
