import { Box, Sans, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import { CommercialInformation_me } from "__generated__/CommercialInformation_me.graphql"
import {
  AuctionTimerState,
  Countdown,
  currentTimerState,
  nextTimerState,
  relevantStateData,
} from "lib/Components/Bidding/Components/Timer"
import { TimeOffsetProvider } from "lib/Components/Bidding/Context/TimeOffsetProvider"
import { StateManager as CountdownStateManager } from "lib/Components/Countdown"
import { Schema, track } from "lib/utils/track"
import { capitalize } from "lodash"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp } from "react-tracking"
import { ArtworkExtraLinksFragmentContainer as ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { AuctionPriceFragmentContainer as AuctionPrice } from "./AuctionPrice"
import { CommercialButtonsFragmentContainer as CommercialButtons } from "./CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformationFragmentContainer as CommercialEditionSetInformation } from "./CommercialEditionSetInformation"
import { CommercialPartnerInformationFragmentContainer as CommercialPartnerInformation } from "./CommercialPartnerInformation"

interface CommercialInformationProps {
  artwork: CommercialInformation_artwork
  me: CommercialInformation_me
  timerState?: AuctionTimerState
  label?: string
  duration?: moment.Duration
  tracking?: TrackingProp
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
        // @ts-ignore STRICTNESS_MIGRATION
        isPreview,
        // @ts-ignore STRICTNESS_MIGRATION
        isClosed,
        // @ts-ignore STRICTNESS_MIGRATION
        liveStartAt: liveStartsAt,
        // @ts-ignore STRICTNESS_MIGRATION
        startAt: startsAt,
        // @ts-ignore STRICTNESS_MIGRATION
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
            {
              ...(this.props as any) /* STRICTNESS_MIGRATION */
            }
          />
        </TimeOffsetProvider>
      )
    } else {
      return <CommercialInformation {...this.props} />
    }
  }
}

@track()
export class CommercialInformation extends React.Component<CommercialInformationProps, CommercialInformationState> {
  // @ts-ignore STRICTNESS_MIGRATION
  state = {
    editionSetID: null,
  }

  interval = null

  componentDidMount = () => {
    const { artwork, timerState } = this.props
    const artworkIsInActiveAuction = artwork.isInAuction && timerState !== AuctionTimerState.CLOSED

    if (artworkIsInActiveAuction) {
      // @ts-ignore STRICTNESS_MIGRATION
      this.props.tracking.trackEvent({
        action_type: Schema.ActionNames.LotViewed,
        artwork_id: artwork.internalID,
        artwork_slug: artwork.slug,
        // @ts-ignore STRICTNESS_MIGRATION
        sale_id: artwork.sale.internalID,
        // @ts-ignore STRICTNESS_MIGRATION
        auction_slug: artwork.sale.slug,
      })
    }
  }

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
          {saleMessage
            ? saleMessage
            : capitalize(
                // @ts-ignore STRICTNESS_MIGRATION
                artwork.availability
              )}
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
    const { artwork, me, timerState } = this.props
    const { editionSetID } = this.state
    const { isAcquireable, isOfferable, isInquireable, isInAuction, sale, isForSale } = artwork

    const isBiddableInAuction = isInAuction && sale && timerState !== AuctionTimerState.CLOSED && isForSale
    const isInClosedAuction = isInAuction && sale && timerState === AuctionTimerState.CLOSED
    const canTakeCommercialAction = isAcquireable || isOfferable || isInquireable || isBiddableInAuction
    // @ts-ignore STRICTNESS_MIGRATION
    const artistIsConsignable = artwork.artists.filter(artist => artist.isConsignable).length
    const hidesPriceInformation = isInAuction && isForSale && timerState === AuctionTimerState.LIVE_INTEGRATION_ONGOING
    return (
      <>
        {this.renderPriceInformation()}
        <Box>
          {canTakeCommercialAction && !isInClosedAuction && (
            <>
              {!hidesPriceInformation && <Spacer mb={2} />}
              <CommercialButtons
                artwork={artwork}
                me={me}
                // @ts-ignore STRICTNESS_MIGRATION
                auctionState={timerState}
                // @ts-ignore STRICTNESS_MIGRATION
                editionSetID={editionSetID}
              />
            </>
          )}
          {isBiddableInAuction && (
            <>
              <Spacer mb={2} />
              <Countdown
                label={this.props.label}
                // @ts-ignore STRICTNESS_MIGRATION
                duration={this.props.duration}
              />
            </>
          )}
          {(!!artistIsConsignable || isAcquireable || isOfferable || isBiddableInAuction) && (
            <>
              <Spacer mb={2} />
              <ArtworkExtraLinks
                artwork={artwork}
                // @ts-ignore STRICTNESS_MIGRATION
                auctionState={timerState}
              />
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
      internalID
      slug

      artists {
        isConsignable
      }

      editionSets {
        id
      }

      sale {
        internalID
        isClosed
        isAuction
        isLiveOpen
        isPreview
        liveStartAt
        endAt
        slug
        startAt
      }

      ...CommercialButtons_artwork
      ...CommercialPartnerInformation_artwork
      ...CommercialEditionSetInformation_artwork
      ...ArtworkExtraLinks_artwork
      ...AuctionPrice_artwork
    }
  `,
  me: graphql`
    fragment CommercialInformation_me on Me {
      ...CommercialButtons_me
    }
  `,
})
