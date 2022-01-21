import { Duration } from "moment"
import { Flex, Sans } from "palette"
import React from "react"

interface TimeSectionProps {
  textProps: ExtractProps<typeof Sans>
  time: string
  label: string
}

const padWithZero = (number: number) => number.toString().padStart(2, "0")

export const durationSections = (duration: Duration, labels: [string, string, string, string]) => [
  {
    time: padWithZero(Math.floor(duration.asDays())),
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

const LabeledTimeSection: React.FC<TimeSectionProps> = ({ time, label, textProps }) => (
  <Flex alignItems="center" justifyContent="center">
    {/* @ts-ignore the size gets overwritten sometimes, that's fine. */}
    <Sans size="3" weight="medium" {...textProps}>
      {time}
      {label}
    </Sans>
  </Flex>
)

interface LabeledTickerProps {
  duration: Duration
  renderSeparator: () => React.ReactElement<any>
  textProps?: ExtractProps<typeof Sans>
}

export const LabeledTicker: React.FC<LabeledTickerProps> = ({
  duration,
  renderSeparator,
  textProps,
}) => {
  const sections = durationSections(duration, ["d", "h", "m", "s"])
  return (
    <Flex flexDirection="row" justifyContent="center" alignItems="center">
      {sections.map((section, idx) => (
        <React.Fragment key={section.label}>
          <LabeledTimeSection
            {...section}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            textProps={textProps}
          />
          {!!(idx < sections.length - 1 && renderSeparator) && renderSeparator()}
        </React.Fragment>
      ))}
    </Flex>
  )
}

interface SimpleTickerProps extends ExtractProps<typeof Sans> {
  duration: Duration
  separator: string
}

export const SimpleTicker: React.FC<SimpleTickerProps> = ({ duration, separator, ...rest }) => {
  const sections = durationSections(duration, ["d", "h", "m", "s"])
  return (
    <Sans {...rest}>
      {sections
        .map(({ time, label }, idx) =>
          idx < sections.length - 1 ? time + label + separator : time + label
        )
        .join("")}
    </Sans>
  )
}
