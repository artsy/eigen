import { CheckCircleFillIcon, Flex, Text, XCircleIcon } from "@artsy/palette"
import React from "react"
import { LotStanding, Sale } from "../shared"
import { Lot } from "./Lot"

export const ActiveLot = ({ ls, sale }: { ls: LotStanding; sale: Sale }) => {
  const sellingPrice = ls?.lotState?.sellingPrice?.displayAmount
  const bidCount = ls?.lotState?.bidCount
  return (
    <Lot ls={ls} sale={sale}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
        <Text variant="caption" color="black60">
          {" "}
          ({bidCount} {bidCount === 1 ? "bid" : "bids"})
        </Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {ls?.isHighestBidder && ls.lotState.reserveStatus !== "ReserveNotMet" ? (
          <>
            <CheckCircleFillIcon fill="green100" />
            <Text variant="caption"> Highest Bid</Text>
          </>
        ) : ls?.isHighestBidder ? (
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
}
