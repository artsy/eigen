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
import { Box, color, Flex, Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp } from "react-tracking"
import styled from "styled-components/native"
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
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        isPreview,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        isClosed,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        liveStartAt: liveStartsAt,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        startAt: startsAt,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

const ColoredDot = styled(Box)<{ dotColor: string }>`
  background-color: ${({ dotColor }: any) => dotColor};
  width: 8px;
  height: 8px;
  border-radius: 8px;
  margin-top: 7px;
  margin-right: 8px;
`

export const SaleAvailability: React.FC<{ dotColor?: string; saleMessage: string }> = ({ dotColor, saleMessage }) => {
  return (
    <Box>
      <Flex flexWrap="nowrap" flexDirection="row" width="100%">
        {!!dotColor && <ColoredDot dotColor={dotColor} />}
        <Sans size="4t" weight="medium">
          {saleMessage}
        </Sans>
      </Flex>
    </Box>
  )
}

@track()
export class CommercialInformation extends React.Component<CommercialInformationProps, CommercialInformationState> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  state = {
    editionSetID: null,
  }

  interval = null

  componentDidMount = () => {
    const { artwork, timerState } = this.props
    const artworkIsInActiveAuction = artwork.isInAuction && timerState !== AuctionTimerState.CLOSED

    if (artworkIsInActiveAuction) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      this.props.tracking.trackEvent({
        action_type: Schema.ActionNames.LotViewed,
        artwork_id: artwork.internalID,
        artwork_slug: artwork.slug,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        sale_id: artwork.sale.internalID,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        auction_slug: artwork.sale.slug,
      })
    }
  }

  renderSingleEditionArtwork = () => {
    const { artwork, timerState } = this.props
    const artworkIsInClosedAuction = artwork.isInAuction && timerState === AuctionTimerState.CLOSED
    const saleMessage = artwork.saleMessage
      ? artwork.saleMessage
      : capitalize(
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          artwork.availability
        )
    let indicatorColor
    let newSaleMessage

    if (artwork.availability?.toLowerCase() === "on loan" || artwork.availability?.toLowerCase() === "on hold") {
      indicatorColor = color("yellow100")
    } else if (
      artwork.availability?.toLowerCase() === "sold" ||
      artwork.availability?.toLowerCase() === "not for sale"
    ) {
      indicatorColor = color("red100")
    } else if (artworkIsInClosedAuction) {
      newSaleMessage = "Bidding closed"
    } else if (artwork.saleMessage?.toLowerCase() === "contact for price" && artwork.isForSale) {
      newSaleMessage = "For sale"
      indicatorColor = color("green100")
    }

    return (
      <>
        <SaleAvailability dotColor={indicatorColor} saleMessage={newSaleMessage ? newSaleMessage : saleMessage} />
        {!artworkIsInClosedAuction && <CommercialPartnerInformation artwork={artwork} />}
      </>
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
        setEditionSetId={(editionSetID) => {
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const artistIsConsignable = artwork.artists.filter((artist) => artist.isConsignable).length
    const hidesPriceInformation = isInAuction && isForSale && timerState === AuctionTimerState.LIVE_INTEGRATION_ONGOING

    return (
      <>
        {this.renderPriceInformation()}
        <Box>
          {!!(canTakeCommercialAction && !isInClosedAuction) && (
            <>
              {!hidesPriceInformation && <Spacer mb="2" />}
              <CommercialButtons
                artwork={artwork}
                me={me}
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                auctionState={timerState}
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                editionSetID={editionSetID}
              />
            </>
          )}
          {!!isBiddableInAuction && (
            <>
              <Spacer mb="2" />
              <Countdown
                label={this.props.label}
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                duration={this.props.duration}
              />
            </>
          )}
          {!!(!!artistIsConsignable || isAcquireable || isOfferable || isBiddableInAuction) && (
            <>
              <Spacer mb="2" />
              <ArtworkExtraLinks
                artwork={artwork}
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
