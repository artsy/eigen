import React from "react"

import moment, { Moment } from "moment-timezone"
import { Flex, Text } from "palette"
import { BoltFill, Stopwatch } from "palette/svgs/sf"

export const SaleTime = ({ sale }: { sale: { liveStartAt?: string | null; endAt?: string | null } }) => {
  const timelyEnd = (sale?.liveStartAt || sale?.endAt) as string

  const tz = moment.tz.guess(true)
  const now = moment().tz(tz)
  const endMoment = moment(timelyEnd, moment.ISO_8601).tz(tz)

  const isSameDay = (d1: Moment, d2: Moment) => d1.isSame(d2, "day")

  let formattedDate
  if (isSameDay(endMoment, now)) {
    formattedDate = `today at ${endMoment.format("h:mma")}`
  } else if (isSameDay(endMoment, now.add(1, "day"))) {
    formattedDate = `tomorrow at ${endMoment.format("h:mma")}`
  } else {
    formattedDate = `at ${endMoment.format("h:mma")} on ${endMoment.format("M/D")}`
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
