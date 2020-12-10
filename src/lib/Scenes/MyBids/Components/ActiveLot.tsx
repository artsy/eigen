import { ActiveLot_lotStanding } from "__generated__/ActiveLot_lotStanding.graphql"
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TimelySale } from "../helpers/timely"
import { HighestBid, Outbid, ReserveNotMet } from "./BiddingStatuses"
import { LotFragmentContainer as Lot } from "./Lot"

export const ActiveLot = ({ lotStanding }: { lotStanding: ActiveLot_lotStanding }, smallScreen: boolean) => {
  const timelySale = TimelySale.create(lotStanding?.saleArtwork?.sale!)

  const sellingPrice = lotStanding?.lotState?.sellingPrice?.display
  const bidCount = lotStanding?.lotState?.bidCount
  const { saleArtwork, lotState } = lotStanding

  const displayBidCount = (): string | undefined => {
    if (isSmallScreen) {
      return
    } else {
      return `(${bidCount.toString() + (bidCount === 1 ? " bid" : " bids")})`
    }
  }

  return (
    saleArtwork &&
    lotState && (
      <Lot saleArtwork={saleArtwork} isSmallScreen={smallScreen}>
        <Flex flexDirection="row" justifyContent="flex-end">
          <Text variant="caption">{sellingPrice}</Text>
          <Text variant="caption" color="black60">
            {" "}
            {displayBidCount()}
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          {!timelySale.isLAI &&
          lotStanding?.isHighestBidder &&
          lotStanding.lotState.reserveStatus === "ReserveNotMet" ? (
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
          display
        }
        sellingPrice: floorSellingPrice {
          display
        }
      }
      saleArtwork {
        ...Lot_saleArtwork
        sale {
          liveStartAt
        }
      }
    }
  `,
})
