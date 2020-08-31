import { CheckCircleFillIcon, Flex, Text, XCircleIcon } from "@artsy/palette"
import { RecentlyClosedLot_lotStanding } from "__generated__/RecentlyClosedLot_lotStanding.graphql"

import { capitalize } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { LotFragmentContainer as Lot } from "./Lot"

const RecentlyClosedLot = ({ lotStanding }: { lotStanding: RecentlyClosedLot_lotStanding }) => {
  const sellingPrice = lotStanding?.lotState?.sellingPrice?.displayAmount
  const displayTime = lotStanding?.saleArtwork?.sale?.displayTimelyAt!
  return (
    <Lot saleArtwork={lotStanding.saleArtwork!} subtitle={capitalize(displayTime)}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {lotStanding?.isHighestBidder && lotStanding?.lotState.soldStatus === "Sold" ? (
          <>
            <CheckCircleFillIcon fill="green100" />
            <Text variant="caption" color="green100">
              {" "}
              You won!
            </Text>
          </>
        ) : (
          <>
            <XCircleIcon fill="red100" />
            <Text variant="caption" color="red100">
              {" "}
              Didn't win
            </Text>
          </>
        )}
      </Flex>
    </Lot>
  )
}

export const RecentlyClosedLotFragmentContainer = createFragmentContainer(RecentlyClosedLot, {
  lotStanding: graphql`
    fragment RecentlyClosedLot_lotStanding on AuctionsLotStanding {
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
