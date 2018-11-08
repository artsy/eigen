import { Sans } from "@artsy/palette"
import { Duration } from "moment-timezone"
import React from "react"
import { SimpleDurationText } from "../../../Duration/DurationText"
import { Flex } from "../../Elements/Flex"

interface Props {
  duration: Duration
  label: string
}

export const Countdown: React.SFC<Props> = ({ duration, label }) => (
  <Flex alignItems="center">
    <SimpleDurationText duration={duration} separator="  " size="4t" weight="medium" />
    <Sans size="2" weight="medium">
      {label}
    </Sans>
  </Flex>
)
