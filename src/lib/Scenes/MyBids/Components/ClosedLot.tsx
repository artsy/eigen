import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import { capitalize } from "lodash"
import { Flex, Text } from "palette"
import { StarCircleFill } from "palette/svgs/sf"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Lost, Passed, Won } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

type BidderResult = "won" | "lost" | "passed"

export const ClosedLot = ({ lotStanding }: { lotStanding: ClosedLot_lotStanding }) => {
  const sellingPrice = lotStanding?.lotState?.sellingPrice?.displayAmount
  const displayTime = lotStanding?.saleArtwork?.sale?.displayTimelyAt!

  const result: BidderResult =
    lotStanding?.lotState.soldStatus === "Passed" ? "passed" : lotStanding?.isHighestBidder ? "won" : "lost"
  const Badge = result === "won" ? StarCircleFill : undefined

  const bidderMessages: { [k in BidderResult]: React.ComponentType } = {
    won: Won,
    lost: Lost,
    passed: Passed,
  }

  const Result = bidderMessages[result]

  return (
    <Lot saleArtwork={lotStanding.saleArtwork!} subtitle={capitalize(displayTime)} ArtworkBadge={Badge}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        <Result />
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
