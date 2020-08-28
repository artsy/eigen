import { CheckCircleFillIcon, Flex, Text, XCircleIcon } from "@artsy/palette"
import { ActiveLot_lotStanding } from "__generated__/ActiveLot_lotStanding.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { LotFragmentContainer as Lot } from "./Lot"

const ActiveLot = ({ lotStanding }: { lotStanding: ActiveLot_lotStanding }) => {
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
          {lotStanding?.isHighestBidder && lotStanding.lotState.reserveStatus !== "ReserveNotMet" ? (
            <>
              <CheckCircleFillIcon fill="green100" />
              <Text variant="caption"> Highest Bid</Text>
            </>
          ) : lotStanding?.isHighestBidder ? (
            <>
              <XCircleIcon fill="red100" />
              <Text variant="caption"> Reserve not met</Text>
            </>
          ) : (
            <>
              <XCircleIcon fill="red100" />
              <Text variant="caption"> Outbid</Text>
            </>
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
