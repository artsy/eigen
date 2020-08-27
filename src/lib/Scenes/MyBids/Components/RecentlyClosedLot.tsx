import { CheckCircleFillIcon, Flex, Text, XCircleIcon } from "@artsy/palette"
import React from "react"
import { LotStanding } from "../shared"
import { Lot } from "./Lot"

export const RecentlyClosedLot = ({ ls }: { ls: LotStanding }) => {
  const sellingPrice = ls?.lotState?.sellingPrice?.displayAmount
  return (
    <Lot ls={ls}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {ls?.isHighestBidder && ls?.lotState.soldStatus === "Sold" ? (
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
