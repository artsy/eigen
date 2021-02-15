import React from "react"

import moment, { Moment } from "moment-timezone"
import { Box, Flex, IconProps, Text } from "palette"
import { BoltFill, Stopwatch } from "palette/svgs/sf"
import { TimelySale } from "../helpers/timely"

export const SaleInfo = ({
  sale,
}: {
  sale: { liveStartAt?: string | null; endAt?: string | null; status?: string | null }
}) => {
  let Icon: React.ComponentType<IconProps>
  let noteColor: string
  let line1: string
  let line2: string | undefined

  const tSale = TimelySale.create(sale)

  const tz = moment.tz.guess(true)
  const now = moment().tz(tz)
  const endMoment = moment(tSale.relevantEnd, moment.ISO_8601).tz(tz)

  const formatTime = (dateTime: Moment): string => {
    const suffix = dateTime.format("a") === "am" ? "a.m." : "p.m."
    const time = dateTime.format("h:mm")
    const timeZone = dateTime.format("z")
    return `${time} ${suffix} (${timeZone})`
  }

  const formatDate = (dateTime: Moment): string => {
    const month =
      dateTime.format("MMMM") === "June" || dateTime.format("MMMM") === "July"
        ? dateTime.format("MMMM")
        : dateTime.format("MMM.")
    const day = dateTime.format("Do")
    return `${month} ${day}`
  }
  const line1Message = (message: string, deadline: Moment): string => {
    if (deadline.isSame(now, "day")) {
      return `${message} today at ${formatTime(endMoment)}`
    } else if (endMoment.isSame(now.clone().add(1, "day"), "day")) {
      return `${message} tomorrow at ${formatTime(endMoment)}`
    } else {
      return `${message} ${formatDate(endMoment)} at ${formatTime(endMoment)}`
    }
  }

  const line2Message = (message: string, deadline: Moment): string | undefined => {
    const hoursTillDeadline = deadline.diff(now, "hours")
    if (now.isBefore(deadline) && hoursTillDeadline <= 10) {
      if (hoursTillDeadline === 0) {
        return `${message} in ${deadline.diff(now, "minutes")} minutes`
      } else if (hoursTillDeadline === 1) {
        return `${message} in ${hoursTillDeadline} hour`
      } else {
        return `${message} in ${hoursTillDeadline} hours`
      }
    }
  }

  if (tSale.isLAI) {
    Icon = BoltFill
    line2 = line2Message("Opens", endMoment)
    if (tSale.isLiveBiddingNow()) {
      noteColor = "purple100"
      line1 = "Live bidding in progress"
    } else {
      noteColor = "black60"
      line1 = line1Message("Live bidding begins", endMoment)
    }
  } else {
    Icon = Stopwatch
    noteColor = "black60"
    line1 = line1Message("Closes", endMoment)
    line2 = line2Message("Ends", endMoment)
  }

  return (
    <Flex style={{ marginTop: 15 }}>
      <Flex flexDirection="row">
        <Box width={25} alignSelf="center">
          <Icon fill={noteColor as any} />
        </Box>
        <Text style={{ flex: -1 }} variant="caption" color={noteColor}>
          {line1}
        </Text>
      </Flex>
      {!!line2 && (
        <Text ml={25} variant="caption" color="yellow100">
          {line2}
        </Text>
      )}
    </Flex>
  )
}
