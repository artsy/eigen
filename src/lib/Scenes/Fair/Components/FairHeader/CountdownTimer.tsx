import React from "react"
import { Sans } from "@artsy/palette"
import { DurationProvider } from "lib/Components/Duration/DurationProvider"
import { LabeledDurationText } from "lib/Components/Duration/DurationText"

export const CountdownTimer: React.SFC<Props> = ({ startAt }) => (
  <DurationProvider startAt={startAt}>
    <LabeledDurationText renderSeparator={() => <Sans size="5">:</Sans>} />
  </DurationProvider>
)
