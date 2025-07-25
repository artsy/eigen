import {
  ArrowheadUpCircleFillIcon,
  ArrowheadDownCircleFillIcon,
  BookmarkFillIcon,
  AlertFillIcon,
} from "@artsy/icons/native"
import { Text } from "@artsy/palette-mobile"

export const ReserveNotMet = () => (
  <>
    <AlertFillIcon />
    <Text variant="xs" color="mono60">
      {" "}
      Reserve not met
    </Text>
  </>
)

export const HighestBid = () => (
  <>
    <ArrowheadUpCircleFillIcon fill="green100" />
    <Text variant="xs" color="green100">
      {" "}
      Highest bid
    </Text>
  </>
)

export const Outbid = () => (
  <>
    <ArrowheadDownCircleFillIcon fill="red100" />
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
  <Text variant="xs" color="mono60">
    Passed
  </Text>
)

export const BiddingLiveNow = () => (
  <>
    <Text variant="xs" color="blue100">
      {" "}
      Bidding live now
    </Text>
  </>
)

export const Watching = () => (
  <>
    <BookmarkFillIcon />
    <Text variant="xs" color="mono60">
      {" "}
      Watching
    </Text>
  </>
)
