import { TimeRemaining } from "@artsy/palette"
import { AuctionCountDownTimer_artwork } from "__generated__/AuctionCountDownTimer_artwork.graphql"
import { DateTime } from "luxon"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AuctionCountDownTimerProps {
  artwork: AuctionCountDownTimer_artwork
}

interface AuctionCountDownTimerState {
  auctionStatus: null | "hasStarted" | "hasEnded" | "hasNotStarted"
}

export class AuctionCountDownTimer extends React.Component<AuctionCountDownTimerProps, AuctionCountDownTimerState> {
  state = {
    auctionStatus: null,
  }

  interval = null

  componentDidMount() {
    const { sale } = this.props.artwork
    if (!sale) {
      return
    }

    this.interval = setInterval(() => {
      if (sale.liveStartAt && DateTime.local() > DateTime.fromISO(sale.liveStartAt)) {
        this.setState({
          auctionStatus: "hasStarted",
        })
      } else if (!sale.liveStartAt && DateTime.local() > DateTime.fromISO(sale.startAt)) {
        this.setState({
          auctionStatus: "hasStarted",
        })
      } else if (DateTime.local() > DateTime.fromISO(sale.endAt)) {
        this.setState({
          auctionStatus: "hasEnded",
        })
      } else {
        this.setState({
          auctionStatus: "hasNotStarted",
        })
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  formatDateTime(date: string) {
    const now = moment().tz(moment.tz.guess(true))
    const dateInMoment = moment(date).tz(moment.tz.guess(true))
    if (now.year() !== dateInMoment.year()) {
      return `${dateInMoment.format("MMM D, YYYY")}, ${dateInMoment.format("h:mma z")}`
    } else {
      return `${dateInMoment.format("MMM D")}, ${dateInMoment.format("h:mma z")}`
    }
  }

  formatDate(date: string) {
    const now = moment().tz(moment.tz.guess(true))
    const dateInMoment = moment(date).tz(moment.tz.guess(true))
    if (now.year() !== dateInMoment.year()) {
      return `${dateInMoment.format("MMM D, YYYY")}`
    } else {
      return `${dateInMoment.format("MMM D")}`
    }
  }

  timerLabelText(startAt: string, liveStartAt: string, endAt: string) {
    const thisMoment = moment()
    const startMoment = moment.tz(startAt)
    const liveStartMoment = moment.tz(liveStartAt)
    const endMoment = moment.tz(endAt)
    if (!liveStartAt && thisMoment.isBefore(startMoment)) {
      return `Starts ${this.formatDateTime(startAt)}`
    } else if (liveStartAt && thisMoment.isBefore(liveStartMoment)) {
      return `Starts ${this.formatDateTime(liveStartAt)}`
    } else if (thisMoment.isBefore(endMoment)) {
      return `Ends ${this.formatDateTime(endAt)}`
    } else if (endAt === null) {
      return null
    } else {
      return `Ended ${this.formatDate(endAt)}`
    }
  }

  render() {
    const { sale } = this.props.artwork
    const { auctionStatus } = this.state

    if (!sale) {
      return null
    }

    const liveStartAtDate = new Date(sale.liveStartAt)
    const todaysDate = new Date()
    const liveSaleHasNotStarted = sale.liveStartAt && liveStartAtDate > todaysDate
    const timerLabel = this.timerLabelText(sale.startAt, sale.liveStartAt, sale.endAt)
    const startAtDate = liveSaleHasNotStarted ? sale.liveStartAt : sale.startAt
    const countdownEnd = auctionStatus === "hasNotStarted" ? startAtDate : sale.endAt

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
        formattedStartDateTime
        liveStartAt
      }
    }
  `,
})
