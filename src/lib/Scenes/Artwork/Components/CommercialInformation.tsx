import { Box, Sans, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import {
  AuctionTimerState,
  Countdown,
  currentTimerState,
  nextTimerState,
  relevantStateData,
} from "lib/Components/Bidding/Components/Timer"
import { TimeOffsetProvider } from "lib/Components/Bidding/Context/TimeOffsetProvider"
import { StateManager as CountdownStateManager } from "lib/Components/Countdown"
import { capitalize } from "lodash"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkExtraLinksFragmentContainer as ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { AuctionPriceFragmentContainer as AuctionPrice } from "./AuctionPrice"
import { CommercialButtonsFragmentContainer as CommercialButtons } from "./CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformationFragmentContainer as CommercialEditionSetInformation } from "./CommercialEditionSetInformation"
import { CommercialPartnerInformationFragmentContainer as CommercialPartnerInformation } from "./CommercialPartnerInformation"

interface CommercialInformationProps {
  artwork: CommercialInformation_artwork
  timerState?: AuctionTimerState
  label?: string
  duration?: moment.Duration
}

interface CommercialInformationState {
  editionSetID: string
}

export class CommercialInformationTimerWrapper extends React.Component<
  CommercialInformationProps,
  CommercialInformationState
> {
  render() {
    if (this.props.artwork.isInAuction) {
      const {
        isPreview,
        isClosed,
        liveStartAt: liveStartsAt,
        startAt: startsAt,
        endAt: endsAt,
      } = this.props.artwork.sale

      return (
        <TimeOffsetProvider>
          <CountdownStateManager
            CountdownComponent={CommercialInformation as any}
            onCurrentTickerState={() => {
              const state = currentTimerState({ isPreview, isClosed, liveStartsAt })
              const { label, date } = relevantStateData(state, { liveStartsAt, startsAt, endsAt })
              return { label, date, state }
            }}
            onNextTickerState={({ state }) => {
              const nextState = nextTimerState(state as AuctionTimerState, { liveStartsAt })
              const { label, date } = relevantStateData(nextState, { liveStartsAt, startsAt, endsAt })
              return { state: nextState, date, label }
            }}
            {...this.props}
          />
        </TimeOffsetProvider>
      )
    } else {
      return <CommercialInformation {...this.props} />
    }
  }
}

export class CommercialInformation extends React.Component<CommercialInformationProps, CommercialInformationState> {
  state = {
    editionSetID: null,
  }

  interval = null

  renderSingleEditionArtwork = () => {
    const { artwork, timerState } = this.props
    const artworkIsInClosedAuction = artwork.isInAuction && timerState === AuctionTimerState.CLOSED

    let saleMessage
    if (artworkIsInClosedAuction) {
      saleMessage = "Bidding closed"
    } else if (artwork.saleMessage === "Contact For Price") {
      saleMessage = "Contact for price"
    } else {
      saleMessage = artwork.saleMessage
    }

    return (
      <Box>
        <Sans size="4t" weight="medium">
          {saleMessage ? saleMessage : capitalize(artwork.availability)}
        </Sans>
        {!artworkIsInClosedAuction && <CommercialPartnerInformation artwork={artwork} />}
      </Box>
    )
  }

  renderPriceInformation = () => {
    const { artwork, timerState } = this.props
    const { isInAuction, isForSale } = artwork
    if (isInAuction && isForSale) {
      if (timerState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
        return null
      } else {
        return <AuctionPrice artwork={artwork} auctionState={timerState as AuctionTimerState} />
      }
    } else if (artwork.editionSets && artwork.editionSets.length > 1) {
      return this.renderEditionSetArtwork()
    } else {
      return this.renderSingleEditionArtwork()
    }
  }

  renderEditionSetArtwork = () => {
    const { artwork } = this.props
    return (
      <CommercialEditionSetInformation
        artwork={artwork}
        setEditionSetId={editionSetID => {
          this.setState({
            editionSetID,
          })
        }}
      />
    )
  }

  render() {
    const { artwork, timerState } = this.props
    const { editionSetID } = this.state
    const { isAcquireable, isOfferable, isInquireable, isInAuction, sale, isForSale } = artwork

    const isBiddableInAuction = isInAuction && sale && timerState !== AuctionTimerState.CLOSED && isForSale
    const isInClosedAuction = isInAuction && sale && timerState === AuctionTimerState.CLOSED
    const canTakeCommercialAction = isAcquireable || isOfferable || isInquireable || isBiddableInAuction
    const artistIsConsignable = artwork.artists.filter(artist => artist.isConsignable).length
    const hidesPriceInformation = isInAuction && isForSale && timerState === AuctionTimerState.LIVE_INTEGRATION_ONGOING
    return (
      <>
        {this.renderPriceInformation()}
        <Box>
          {canTakeCommercialAction &&
            !isInClosedAuction && (
              <>
                {!hidesPriceInformation && <Spacer mb={2} />}
                <CommercialButtons artwork={artwork} auctionState={timerState} editionSetID={editionSetID} />
              </>
            )}
          {isBiddableInAuction && (
            <>
              <Spacer mb={2} />
              <Countdown label={this.props.label} duration={this.props.duration} />
            </>
          )}
          {(!!artistIsConsignable || isAcquireable || isOfferable || isBiddableInAuction) && (
            <>
              <Spacer mb={2} />
              <ArtworkExtraLinks artwork={artwork} auctionState={timerState} />
            </>
          )}
        </Box>
      </>
    )
  }
}

export const CommercialInformationFragmentContainer = createFragmentContainer(CommercialInformationTimerWrapper, {
  artwork: graphql`
    fragment CommercialInformation_artwork on Artwork {
      isAcquireable
      isOfferable
      isInquireable
      isInAuction
      availability
      saleMessage
      isForSale

      artists {
        isConsignable
      }

      editionSets {
        id
      }

      sale {
        isClosed
        isAuction
        isLiveOpen
        isPreview
        liveStartAt
        endAt
        startAt
      }

      ...CommercialButtons_artwork
      ...CommercialPartnerInformation_artwork
      ...CommercialEditionSetInformation_artwork
      ...ArtworkExtraLinks_artwork
      ...AuctionPrice_artwork
    }
  `,
})
