import { TimeRemaining } from "@artsy/palette"
import { AuctionCountDownTimer_artwork } from "__generated__/AuctionCountDownTimer_artwork.graphql"
import { DateTime } from "luxon"
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
    if (!sale || !sale.startAt || !sale.endAt) {
      return
    }

    this.interval = setInterval(() => {
      if (DateTime.local() > DateTime.fromISO(sale.startAt)) {
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

  render() {
    const { sale } = this.props.artwork
    const { auctionStatus } = this.state

    if (!sale || !sale.startAt || !sale.endAt) {
      return null
    }

    return (
      <TimeRemaining
        labelWithTimeRemaining={sale.formattedStartDateTime}
        labelWithoutTimeRemaining={sale.formattedStartDateTime}
        labelFontSize="2"
        timerFontSize="4t"
        countdownEnd={auctionStatus === "hasNotStarted" ? sale.startAt : sale.endAt}
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
        formattedStartDateTime
      }
    }
  `,
})
