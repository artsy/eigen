import React from "react"
import { Countdown } from "./Countdown"
import { StateManager } from "./StateManager"
import { TimeOffsetProvider } from "./TimeOffsetProvider"

interface Props {
  liveStartsAt?: string
  endsAt?: string
  isPreview?: boolean
  isClosed?: boolean
  startsAt?: string
}

export const Timer: React.SFC<Props> = props => (
  <TimeOffsetProvider>
    <StateManager Component={Countdown} {...props} />
  </TimeOffsetProvider>
)
