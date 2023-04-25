import { Flex, Text, TimerIcon } from "@artsy/palette-mobile"
import { getTimerInfo } from "app/utils/saleTime"
import { Time, useTimer } from "app/utils/useTimer"
import { DateTime } from "luxon"
import moment from "moment"
import { useState } from "react"
import useInterval from "react-use/lib/useInterval"

interface UrgencyInfoProps {
  endAt: string
  isLiveAuction?: boolean
  startAt: string
  saleTimeZone: string
}

export const UrgencyInfo: React.FC<UrgencyInfoProps> = (props) => {
  const { timeText, color } = useTimeText(props)
  const { hasStarted } = useTimer(props.endAt, props.startAt)
  const showDate =
    timeText !== "In progress" && props.isLiveAuction && !hasStarted && !!props.startAt
  const startDateTime = DateTime.fromISO(props.startAt)
  const isSameYear = DateTime.now().year === startDateTime.year
  const formattedDate = startDateTime.toFormat(isSameYear ? "LLL dd, t" : "ff")

  if (timeText) {
    return (
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center">
          <TimerIcon height={16} width={16} fill={color} />
          <Text variant="xs" italic color={color ?? "black100"}>
            {" "}
            {timeText}
          </Text>
        </Flex>
        {showDate && (
          <Text variant="xs" color="black60">
            {formattedDate}
          </Text>
        )}
      </Flex>
    )
  }
  return null
}

const getInfo = (time: Time) => {
  const { days, hours, minutes, seconds } = time

  const parsedDays = parseInt(days, 10)
  const parsedHours = parseInt(hours, 10)
  const parsedMinutes = parseInt(minutes, 10)
  const parsedSeconds = parseInt(seconds, 10)

  if (parsedDays >= 1) {
    return parsedDays + ` ${parsedDays > 1 ? " days " : " day"}`
  } else if (parsedHours >= 1) {
    return `${parsedHours}h` + ` ${parsedMinutes}m`
  } else if (parsedMinutes >= 1) {
    return `${parsedMinutes}m` + ` ${parsedSeconds}s`
  } else if (parsedSeconds >= 1) {
    return `${parsedSeconds}s`
  }
  return ""
}

const useTimeText = (props: UrgencyInfoProps) => {
  const { isLiveAuction, startAt, endAt, saleTimeZone } = props

  const [timeText, setTimeText] = useState("")
  const [color, setColor] = useState<string | undefined>(undefined)

  const userTimeZone = moment.tz.guess()

  const callback = () => {
    let prefix = isLiveAuction ? "Live in" : ""
    let suffix = isLiveAuction ? "" : "left"
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { time, hasEnded, hasStarted } = useTimer(endAt, startAt)

    const { color: textColor } = getTimerInfo(time, {
      saleHasEnded: hasEnded,
      isSaleInfo: true,
      hasStarted,
    })

    const text = getInfo(time)

    const startDateMoment = !!startAt
      ? moment.tz(startAt, moment.ISO_8601, saleTimeZone).tz(userTimeZone)
      : null
    const endDateMoment = !!endAt
      ? moment.tz(endAt, moment.ISO_8601, saleTimeZone).tz(userTimeZone)
      : null
    const now = moment()

    if (
      startDateMoment !== null &&
      now.isAfter(startDateMoment) &&
      endDateMoment !== null &&
      now.isBefore(endDateMoment)
    ) {
      prefix = ""
      suffix = "left"
    } else if (!endAt && !hasEnded && hasStarted) {
      setTimeText("In progress")
      setColor("blue100")
      return
    }
    setTimeText(!!text ? prefix + `${!!prefix ? " " : ""}${text} ` + suffix : "")
    setColor(textColor)
  }

  useInterval(callback, 1000)

  return { color, timeText }
}
