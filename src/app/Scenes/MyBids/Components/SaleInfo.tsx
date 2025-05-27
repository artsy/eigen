import { BoltFillIcon } from "@artsy/icons/native"
import { IconProps, Stopwatch, Flex, Box, Text } from "@artsy/palette-mobile"
import { TimelySale } from "app/Scenes/MyBids/helpers/timely"
import { DateTime } from "luxon"
import ordinal from "ordinal"

export const SaleInfo = ({
  sale,
}: {
  sale: { liveStartAt?: string | null; endAt?: string | null; status?: string | null }
}) => {
  let Icon: React.ComponentType<IconProps> | typeof BoltFillIcon
  let noteColor: string
  let line1: string
  let line2: string | undefined

  const tSale = TimelySale.create(sale)

  const now = DateTime.now()
  const endMoment = DateTime.fromISO(tSale.relevantEnd)

  const formatTime = (dateTime: DateTime): string => {
    const suffix = dateTime.toFormat("a") === "AM" ? "a.m." : "p.m."
    const time = dateTime.toFormat("h:mm")
    const timeZone = dateTime.toFormat("ZZZZ")
    return `${time} ${suffix} (${timeZone})`
  }

  const formatDate = (dateTime: DateTime): string => {
    const month =
      dateTime.toFormat("MMMM") === "June" || dateTime.toFormat("MMMM") === "July"
        ? dateTime.toFormat("MMMM")
        : dateTime.toFormat("MMM.")
    const day = ordinal(parseInt(dateTime.toFormat("d"), 10))
    return `${month} ${day}`
  }
  const line1Message = (message: string, deadline: DateTime): string => {
    if (deadline.hasSame(now, "day")) {
      return `${message} today at ${formatTime(endMoment)}`
    } else if (endMoment.hasSame(now.plus({ day: 1 }), "day")) {
      return `${message} tomorrow at ${formatTime(endMoment)}`
    } else {
      return `${message} ${formatDate(endMoment)} at ${formatTime(endMoment)}`
    }
  }

  const line2Message = (message: string, deadline: DateTime): string | undefined => {
    const hoursTillDeadline = Math.floor(deadline.diff(now, "hours").as("hours"))
    if (now < deadline && hoursTillDeadline <= 10) {
      if (hoursTillDeadline === 0) {
        return `${message} in ${Math.floor(deadline.diff(now, "minutes").as("minutes"))} minutes`
      } else if (hoursTillDeadline === 1) {
        return `${message} in ${hoursTillDeadline} hour`
      } else {
        return `${message} in ${hoursTillDeadline} hours`
      }
    }
  }

  if (tSale.isLAI) {
    Icon = BoltFillIcon
    line2 = line2Message("Opens", endMoment)
    if (tSale.isLiveBiddingNow()) {
      noteColor = "blue100"
      line1 = "Live bidding in progress"
    } else {
      noteColor = "mono60"
      line1 = line1Message("Live bidding begins", endMoment)
    }
  } else {
    Icon = Stopwatch
    noteColor = "mono60"
    line1 = line1Message("Closes", endMoment)
    line2 = line2Message("Ends", endMoment)
  }

  return (
    <Flex style={{ marginTop: 15 }}>
      <Flex flexDirection="row">
        <Box width="25px" alignSelf="center">
          <Icon fill={noteColor as any} />
        </Box>
        <Text style={{ flex: -1 }} variant="xs" color={noteColor}>
          {line1}
        </Text>
      </Flex>
      {!!line2 && (
        <Text ml="25px" variant="xs" color="copper100">
          {line2}
        </Text>
      )}
    </Flex>
  )
}
