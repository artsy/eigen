import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import { capitalize } from "lodash"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Lost, Passed, Won } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

const ClosedLot = ({ lotStanding }: { lotStanding: ClosedLot_lotStanding }) => {
  const sellingPrice = lotStanding?.lotState?.sellingPrice?.displayAmount
  const displayTime = lotStanding?.saleArtwork?.sale?.displayTimelyAt!
  return (
    <Lot saleArtwork={lotStanding.saleArtwork!} subtitle={capitalize(displayTime)}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {lotStanding?.lotState.soldStatus === "Passed" ? <Passed /> : lotStanding?.isHighestBidder ? <Won /> : <Lost />}
      </Flex>
    </Lot>
  )
}

export const ClosedLotFragmentContainer = createFragmentContainer(ClosedLot, {
  lotStanding: graphql`
    fragment ClosedLot_lotStanding on AuctionsLotStanding {
      isHighestBidder
      lotState {
        internalID
        saleId
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
        sale {
          displayTimelyAt
        }
      }
    }
  `,
})
