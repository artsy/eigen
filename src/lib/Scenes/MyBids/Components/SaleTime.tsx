import React from "react"

import { capitalize } from "lodash"
import moment, { Moment } from "moment-timezone"
import { Box, Flex, IconProps, Text } from "palette"
import { BoltFill, Stopwatch } from "palette/svgs/sf"

export const SaleTime = ({
  sale,
}: {
  sale: { displayTimelyAt?: string | null; liveStartAt?: string | null; endAt?: string | null }
}) => {
  const isLAI = !!sale?.liveStartAt

  let Icon: React.ComponentType<IconProps>
  let endMoment: Moment
  let endMessage: string

  const tz = moment.tz.guess(true)
  const now = moment().tz(tz)

  if (isLAI) {
    Icon = BoltFill
    const timelyEnd = sale?.liveStartAt as string
    endMoment = moment(timelyEnd, moment.ISO_8601).tz(tz)
    endMessage = "Live bidding begins"
  } else {
    Icon = Stopwatch
    const timelyEnd = sale?.endAt as string
    endMoment = moment(timelyEnd, moment.ISO_8601).tz(tz)
    endMessage = "Closes"
  }

  const isSameDay = (d1: Moment, d2: Moment) => d1.isSame(d2, "day")

  let line1
  if (isSameDay(endMoment, now)) {
    line1 = `${endMessage} today at ${endMoment.format("h:mma")}`
  } else if (isSameDay(endMoment, now.add(1, "day"))) {
    line1 = `${endMessage} tomorrow at ${endMoment.format("h:mma")}`
  } else {
    line1 = `${endMessage} at ${endMoment.format("h:mma")} on ${endMoment.format("M/D")}`
  }

  const line2 =
    !!sale?.displayTimelyAt && `${isLAI ? "Live Auction" : "Timed Auction"} • ${capitalize(sale?.displayTimelyAt)}`

  const noteColor = isLAI ? "purple100" : "black60"

  return (
    <>
      <Flex style={{ marginTop: 15 }} flexDirection="row">
        <Box mr={5} alignSelf="center">
          <Icon fill={noteColor} />
        </Box>
        <Box style={{ flex: -1 }}>
          <Text variant="caption" color={noteColor}>
            {line1}
          </Text>
        </Box>
      </Flex>
      {!!line2 && (
        <Text variant="caption" color="black60">
          {line2}
        </Text>
      )}
    </>
  )
}
