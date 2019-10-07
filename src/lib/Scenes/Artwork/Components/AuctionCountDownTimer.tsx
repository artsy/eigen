import { TimeRemaining } from "@artsy/palette"
import { AuctionCountDownTimer_artwork } from "__generated__/AuctionCountDownTimer_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { AuctionState } from "./CommercialInformation"

interface AuctionCountDownTimerProps {
  artwork: AuctionCountDownTimer_artwork
  auctionState: AuctionState
}

export class AuctionCountDownTimer extends React.Component<AuctionCountDownTimerProps> {
  render() {
    const { auctionState } = this.props
    const { sale } = this.props.artwork

    if (!sale || !sale.startAt || !sale.endAt) {
      return null
    }

    return (
      <TimeRemaining
        labelWithTimeRemaining={sale.formattedStartDateTime}
        labelWithoutTimeRemaining={sale.formattedStartDateTime}
        labelFontSize="2"
        timerFontSize="4t"
        countdownEnd={auctionState === "isPreview" ? sale.startAt : sale.endAt}
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
      }
    }
  `,
})
