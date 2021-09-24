import { ArrowDownCircleFillIcon, ArrowUpCircleFillIcon, Text } from "palette"
import { BookmarkFill, ExclamationMarkCircleFill } from "palette/svgs/sf"
import React from "react"

export const ReserveNotMet = () => (
  <>
    <ExclamationMarkCircleFill />
    <Text variant="xs" color="black60">
      {" "}
      Reserve not met
    </Text>
  </>
)

export const HighestBid = () => (
  <>
    <ArrowUpCircleFillIcon fill="green100" />
    <Text variant="xs" color="green100">
      {" "}
      Highest bid
    </Text>
  </>
)

export const Outbid = () => (
  <>
    <ArrowDownCircleFillIcon fill="red100" />
    <Text variant="xs" color="red100">
      {" "}
      Outbid
    </Text>
  </>
)

export const Won = () => (
  <Text variant="xs" color="green100">
    You won!
  </Text>
)

export const Lost = () => (
  <Text variant="xs" color="red100">
    Outbid
  </Text>
)

export const Passed = () => (
  <Text variant="xs" color="black60">
    Passed
  </Text>
)

export const Watching = () => (
  <>
    <BookmarkFill />
    <Text variant="xs" color="black60">
      {" "}
      Watching
    </Text>
  </>
)
