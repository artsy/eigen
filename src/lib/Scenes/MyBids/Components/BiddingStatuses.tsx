import { ArrowDownCircleFillIcon, ArrowUpCircleFillIcon, Text } from "palette"
import React from "react"

export const ReserveNotMet = () => (
  <>
    <ArrowUpCircleFillIcon fill="black60" />
    <Text variant="caption" color="black60">
      {" "}
      Reserve not met
    </Text>
  </>
)

export const HighestBid = () => (
  <>
    <ArrowUpCircleFillIcon fill="green100" />
    <Text variant="caption" color="green100">
      {" "}
      Highest bid
    </Text>
  </>
)

export const Outbid = () => (
  <>
    <ArrowDownCircleFillIcon fill="red100" />
    <Text variant="caption" color="red100">
      {" "}
      Outbid
    </Text>
  </>
)

export const Won = () => (
  <Text variant="caption" color="green100">
    You won!
  </Text>
)

export const Lost = () => (
  <Text variant="caption" color="red100">
    Outbid
  </Text>
)

export const Passed = () => (
  <Text variant="caption" color="black60">
    Passed
  </Text>
)
