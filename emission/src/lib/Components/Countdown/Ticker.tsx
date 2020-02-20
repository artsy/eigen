import { Flex, Sans } from "@artsy/palette"
import { SansProps } from "@artsy/palette/dist/elements/Typography"
import { Duration } from "moment"
import React from "react"

interface TimeSectionProps {
  textProps: SansProps
  time: string
  label: string
}

const padWithZero = (number: number) => (number.toString() as any).padStart(2, "0")
const durationSections = (duration: Duration, labels: [string, string, string, string]) => [
  {
    time: padWithZero(duration.days()),
    label: labels[0],
  },
  {
    time: padWithZero(duration.hours()),
    label: labels[1],
  },
  {
    time: padWithZero(duration.minutes()),
    label: labels[2],
  },
  {
    time: padWithZero(duration.seconds()),
    label: labels[3],
  },
]

const LabeledTimeSection: React.SFC<TimeSectionProps> = ({ time, label, textProps }) => (
  <Flex alignItems="center" justifyContent="center">
    <Sans size="3" weight="medium" {...textProps}>
      {time}
      {label}
    </Sans>
  </Flex>
)

interface LabeledTickerProps {
  duration: Duration
  renderSeparator: () => React.ReactElement<any>
  textProps?: SansProps
}

export const LabeledTicker: React.SFC<LabeledTickerProps> = ({ duration, renderSeparator, textProps }) => {
  const sections = durationSections(duration, ["d", "h", "m", "s"])
  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      {sections.map((section, idx) => (
        <React.Fragment key={section.label}>
          <LabeledTimeSection {...section} textProps={textProps} />
          {idx < sections.length - 1 && renderSeparator && renderSeparator()}
        </React.Fragment>
      ))}
    </Flex>
  )
}

interface SimpleTickerProps extends SansProps {
  duration: Duration
  separator: string
}

export const SimpleTicker: React.SFC<SimpleTickerProps> = ({ duration, separator, ...rest }) => {
  const sections = durationSections(duration, ["d", "h", "m", "s"])
  return (
    <Sans {...rest}>
      {sections
        .map(({ time, label }, idx) => (idx < sections.length - 1 ? time + label + separator : time + label))
        .join("")}
    </Sans>
  )
}
