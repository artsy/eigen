import { Flex, Text, TimerIcon } from "@artsy/palette-mobile"
import { Time, getTimer } from "app/utils/getTimer"
import { DateTime } from "luxon"
import moment from "moment-timezone"
import { useEffect, useState } from "react"
import useInterval from "react-use/lib/useInterval"

interface UrgencyInfoProps {
  endAt: string
  isLiveAuction?: boolean
  onTimerEnd?: () => void
  startAt: string
  saleTimeZone: string
}

export const UrgencyInfo: React.FC<UrgencyInfoProps> = (props) => {
  const { timeText, previousTimeText, color } = useTimeText(props)
  const { hasStarted } = getTimer(props.endAt, props.startAt)
  const showDate =
    timeText !== "In progress" && props.isLiveAuction && !hasStarted && !!props.startAt
  const startDateTime = DateTime.fromISO(props.startAt)
  const isSameYear = DateTime.now().year === startDateTime.year
  const formattedDate = startDateTime.toFormat(isSameYear ? "LLL dd, t" : "ff")

  useEffect(() => {
    if (!!previousTimeText && !timeText) {
      // lot just closed
      props.onTimerEnd?.()
    }
  }, [timeText, previousTimeText, color])

  if (timeText) {
    return (
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center">
          <TimerIcon height={16} width={16} fill={color} />
          <Text variant="xs" italic color={color ?? "mono100"}>
            {" "}
            {timeText}
          </Text>
        </Flex>
        {!!showDate && (
          <Text variant="xs" color="mono60">
            {formattedDate}
          </Text>
        )}
      </Flex>
    )
  }
  return null
}

const getInfo = (time: Time): { text: string; textColor: "blue100" | "red100" } => {
  const { days, hours, minutes, seconds } = time

  const parsedDays = parseInt(days, 10)
  const parsedHours = parseInt(hours, 10)
  const parsedMinutes = parseInt(minutes, 10)
  const parsedSeconds = parseInt(seconds, 10)

  if (parsedDays >= 1) {
    return { text: parsedDays + ` ${parsedDays > 1 ? " days " : " day"}`, textColor: "blue100" }
  } else if (parsedHours >= 1) {
    return { text: `${parsedHours}h` + ` ${parsedMinutes}m`, textColor: "blue100" }
  } else if (parsedMinutes >= 1) {
    return { text: `${parsedMinutes}m` + ` ${parsedSeconds}s`, textColor: "red100" }
  } else if (parsedSeconds >= 1) {
    return { text: `${parsedSeconds}s`, textColor: "red100" }
  }
  return { text: "", textColor: "blue100" }
}

const useTimeText = (props: UrgencyInfoProps) => {
  const { isLiveAuction, startAt, endAt, saleTimeZone } = props

  const [timerInfoText, setTimerInfoText] = useState({ prev: "", current: "" })
  const [color, setColor] = useState<string | undefined>(undefined)

  const userTimeZone = moment.tz.guess()

  const callback = () => {
    let prefix = isLiveAuction ? "Live in" : ""
    let suffix = isLiveAuction ? "" : "left"
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { time, hasEnded, hasStarted } = getTimer(endAt, startAt)

    const { text, textColor } = getInfo(time)

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
      setTimerInfoText({ current: "In progress", prev: timerInfoText.current })
      setColor("blue100")
      return
    }
    setTimerInfoText({
      current: !!text ? prefix + `${!!prefix ? " " : ""}${text} ` + suffix : "",
      prev: timerInfoText.current,
    })
    setColor(textColor)
  }

  useInterval(callback, 1000)

  const { prev: previousTimeText, current: timeText } = timerInfoText
  return { color, previousTimeText, timeText }
}
