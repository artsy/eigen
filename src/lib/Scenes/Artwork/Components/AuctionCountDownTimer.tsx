import { TimeRemaining } from "@artsy/palette"
import { AuctionCountDownTimer_artwork } from "__generated__/AuctionCountDownTimer_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { formatDate, formatDateTime } from "../../../utils/formatDates"
import { AuctionState } from "./CommercialInformation"

interface AuctionCountDownTimerProps {
  artwork: AuctionCountDownTimer_artwork
  auctionState: AuctionState
}

export const timeUntil = (startAt, liveStartAt, endAt, auctionState) => {
  if (auctionState === "isPreview") {
    return `Starts ${formatDateTime(startAt)}`
  } else if (liveStartAt && auctionState === "hasStarted") {
    return `Live ${formatDateTime(liveStartAt)}`
  } else if (auctionState === "isLive") {
    return `In progress`
  } else if (auctionState === "hasEnded") {
    return `Ended ${formatDate(endAt)}`
  } else if (endAt && auctionState === "hasStarted") {
    return `Ends ${formatDateTime(endAt)}`
  } else {
    return null
  }
}

export class AuctionCountDownTimer extends React.Component<AuctionCountDownTimerProps> {
  countdownValue(sale, auctionState) {
    if (auctionState === "isPreview") {
      return sale.startAt
    } else if (auctionState === "hasStarted" && sale.liveStartAt) {
      return sale.liveStartAt
    } else {
      return sale.endAt
    }
  }

  render() {
    const { auctionState } = this.props
    const { sale } = this.props.artwork

    if (!sale) {
      return null
    }

    const timerLabel = timeUntil(sale.startAt, sale.liveStartAt, sale.endAt, auctionState)
    const countdownEnd = this.countdownValue(sale, auctionState)

    if (!countdownEnd) {
      return null
    }

    return (
      <TimeRemaining
        labelWithTimeRemaining={timerLabel}
        labelWithoutTimeRemaining={timerLabel}
        labelFontSize="2"
        timerFontSize="4t"
        countdownEnd={countdownEnd}
        highlight="black100"
      />
    )
  }
}

export const AuctionCountDownTimerFragmentContainer = createFragmentContainer(AuctionCountDownTimer, {
  artwork: graphql`
    fragment AuctionCountDownTimer_artwork on Artwork {
      sale {
        startAt
        endAt
        liveStartAt
      }
    }
  `,
})
