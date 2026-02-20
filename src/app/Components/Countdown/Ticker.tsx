import { Flex, Text, TextProps } from "@artsy/palette-mobile"
import { Time } from "app/utils/getTimer"
import { getTimerInfo } from "app/utils/saleTime"
import { Duration } from "luxon"
import React from "react"
import { CountdownTimerProps } from "./CountdownTimer"

interface TimeSectionProps {
  textProps: TextProps
  time: string
  label: string
}

const padWithZero = (number: number) => number.toString().padStart(2, "0")

export const durationSections = (duration: Duration, labels: [string, string, string, string]) => [
  {
    time: padWithZero(Math.floor(duration.as("days"))),
    label: labels[0],
  },
  {
    time: padWithZero(Math.floor(duration.as("hours") % 24)),
    label: labels[1],
  },
  {
    time: padWithZero(Math.floor(duration.as("minutes") % 60)),
    label: labels[2],
  },
  {
    time: padWithZero(Math.floor(duration.as("seconds") % 60)),
    label: labels[3],
  },
]

const LabeledTimeSection: React.FC<TimeSectionProps> = ({ time, label, textProps }) => (
  <Flex alignItems="center" justifyContent="center">
    {/* @ts-ignore the size gets overwritten sometimes, that's fine. */}
    <Text variant="sm" weight="medium" {...textProps}>
      {time}
      {label}
    </Text>
  </Flex>
)

interface LabeledTickerProps {
  duration: CountdownTimerProps["duration"]
  renderSeparator: () => React.ReactElement<any>
  textProps?: ExtractProps<typeof Text>
}

export const LabeledTicker: React.FC<LabeledTickerProps> = ({
  duration,
  renderSeparator,
  textProps,
}) => {
  const sections = duration ? durationSections(duration, ["d", "h", "m", "s"]) : []
  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      {sections.map((section, idx) => (
        <React.Fragment key={section.label}>
          <LabeledTimeSection {...section} textProps={textProps || {}} />
          {!!(idx < sections.length - 1 && renderSeparator) && renderSeparator()}
        </React.Fragment>
      ))}
    </Flex>
  )
}

interface SimpleTickerProps extends TextProps {
  duration: CountdownTimerProps["duration"]
  separator: string
}

export const SimpleTicker: React.FC<SimpleTickerProps> = ({ duration, separator, ...rest }) => {
  const sections = duration ? durationSections(duration, ["d", "h", "m", "s"]) : []
  return (
    <Text accessibilityLabel="Simple Ticker" {...rest}>
      {sections
        .map(({ time, label }, idx) =>
          idx < sections.length - 1 ? time + label + separator : time + label
        )
        .join("")}
    </Text>
  )
}

interface ModernTickerProps extends TextProps {
  duration: CountdownTimerProps["duration"]
  hasStarted?: boolean
  isExtended?: boolean
}

export const ModernTicker: React.FC<ModernTickerProps> = ({
  duration,
  hasStarted,
  isExtended,
  ...rest
}) => {
  if (!duration) {
    return null
  }
  const time: Time = {
    days: Math.floor(duration.as("days")).toString(),
    hours: Math.floor(duration.as("hours") % 24).toString(),
    minutes: Math.floor(duration.as("minutes") % 60).toString(),
    seconds: Math.floor(duration.as("seconds") % 60).toString(),
  }
  const timerInfo = getTimerInfo(time, { hasStarted, isExtended })

  return (
    <Text color={timerInfo.color} accessibilityLabel="Modern Ticker" {...rest}>
      {timerInfo.copy}
    </Text>
  )
}
