import moment from "moment-timezone"
import React from "react"
import { Stopwatch } from "palette/svgs/sf/Stopwatch"
import { Text, Flex } from "palette"
import { BoltFill } from "palette/svgs/sf/BoltFill"

export const SaleTime = ({ sale }: { sale: { liveStartAt?: string | null; endAt?: string | null } }) => {
  const datetime = (sale?.liveStartAt || sale?.endAt) as string
  const dateInMoment = moment(datetime, moment.ISO_8601).tz(moment.tz.guess(true))
  const now = moment()

  let formattedDate
  if (now.day() === dateInMoment.day()) {
    formattedDate = `today at ${dateInMoment.format("h:mma")}`
  } else if (now.add(1, "day").day() === dateInMoment.day()) {
    formattedDate = `tomorrow at ${dateInMoment.format("h:mma")}`
  } else {
    formattedDate = `at ${dateInMoment.format("h:mma")} on ${dateInMoment.format("M/D")}`
  }

  if (sale?.liveStartAt) {
    return (
      <Flex flexDirection="row">
        <BoltFill fill="purple100" mr={0.5} />
        <Text variant="caption" color="purple100">
          Live bidding begins {formattedDate}
        </Text>
      </Flex>
    )
  } else {
    return (
      <Flex flexDirection="row">
        <Stopwatch mr={0.5} />
        <Text variant="caption" color="black60">
          Closes {formattedDate}
        </Text>
      </Flex>
    )
  }
}
