import { TimeRemaining } from "@artsy/palette"
import { AuctionCountDownTimer_artwork } from "__generated__/AuctionCountDownTimer_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { formatDate, formatDateTime, timeUntil } from "../../../utils/formatDates"
import { AuctionState } from "./CommercialInformation"

interface AuctionCountDownTimerProps {
  artwork: AuctionCountDownTimer_artwork
  auctionState: AuctionState
}

export class AuctionCountDownTimer extends React.Component<AuctionCountDownTimerProps> {
  countdownValue(sale) {
    const liveStartAtDate = new Date(sale.liveStartAt)
    const startAtDate = new Date(sale.startAt)
    // const endAtDate = new Date(sale.andAt)
    const todaysDate = new Date()

    if (startAtDate > todaysDate) {
      return sale.startAt
    } else if (liveStartAtDate && liveStartAtDate > todaysDate) {
      return sale.liveStartAt
    } else {
      return sale.endAt
    }
  }

  timeUntil = (startAt, liveStartAt, endAt, auctionState) => {
    if (auctionState === "isPreview") {
      return `Starts ${formatDateTime(startAt)}`
    } else if (liveStartAt && auctionState === "hasStarted") {
      return `Live ${formatDateTime(liveStartAt)}`
    } else if (auctionState === "isLive") {
      return `In progress`
    } else if (auctionState === "hasEnded") {
      return `Ended ${formatDate(endAt)}`
    } else if (endAt === null) {
      return null
    } else {
      return `Ends ${formatDateTime(endAt)}`
    }
  }

  xcountdownValue(sale, auctionState) {
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

    // const liveStartAtDate = new Date(sale.liveStartAt)
    // const todaysDate = new Date()
    // const liveSaleHasNotStarted = sale.liveStartAt && liveStartAtDate > todaysDate

    // const timerLabel = timeUntil(sale.startAt, sale.liveStartAt, sale.endAt)

    const timerLabel = this.timeUntil(sale.startAt, sale.liveStartAt, sale.endAt, auctionState)
    const startAtDate = sale.liveStartAt && auctionState === "hasStarted" ? sale.liveStartAt : sale.startAt

    // const countdownEnd = auctionState === "hasEnded" ? sale.endAt : startAtDate
    // const countdownEnd = auctionState === "" ? startAtDate : sale.endAt
    // const countdownEnd = this.countdownValue(sale)
    const countdownEnd = this.xcountdownValue(sale, auctionState)
    console.log("countdownEnd", countdownEnd)
    if (!countdownEnd) {
      console.log("countdownEnd", countdownEnd)
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
