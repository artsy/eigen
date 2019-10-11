import { Box, Sans, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import { capitalize } from "lodash"
import { DateTime } from "luxon"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkExtraLinksFragmentContainer as ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { AuctionCountDownTimerFragmentContainer as AuctionCountDownTimer } from "./AuctionCountDownTimer"
import { AuctionPriceFragmentContainer as AuctionPrice } from "./AuctionPrice"
import { CommercialButtonsFragmentContainer as CommercialButtons } from "./CommercialButtons/CommercialButtons"
import { CommercialEditionSetInformationFragmentContainer as CommercialEditionSetInformation } from "./CommercialEditionSetInformation"
import { CommercialPartnerInformationFragmentContainer as CommercialPartnerInformation } from "./CommercialPartnerInformation"

interface CommercialInformationProps {
  artwork: CommercialInformation_artwork
}

export type AuctionState = "hasStarted" | "isLive" | "hasEnded" | "isPreview" | null

interface CommercialInformationState {
  editionSetID: string
  auctionState: AuctionState
}

// Possible states for an auction:
// - isPreview: Auction is open for registration but artworks cannot be bid on. This occurs when the current time is before any auction's startAt.
// - hasStarted: Auction has started but live auction, if one exists, has not
// - isLive: Live auction is in progress
// - hasEnded: Auction is over

const initialAuctionState = sale => {
  if (sale && sale.isAuction) {
    if (sale.isClosed) {
      return "hasEnded"
    } else if (sale.isLiveOpen) {
      return "isLive"
    } else if (sale.isPreview) {
      return "isPreview"
    } else if (DateTime.local() > DateTime.fromISO(sale.startAt)) {
      return "hasStarted"
    }
  } else {
    return null
  }
}

export class CommercialInformation extends React.Component<CommercialInformationProps, CommercialInformationState> {
  state = {
    editionSetID: null,
    auctionState: initialAuctionState(this.props.artwork.sale) as AuctionState,
  }

  interval = null

  renderSingleEditionArtwork = () => {
    const { artwork } = this.props
    const { auctionState } = this.state
    let saleMessage
    if (artwork.isInAuction && artwork.sale && auctionState === "hasEnded") {
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
        <CommercialPartnerInformation artwork={artwork} />
      </Box>
    )
  }

  renderPriceInformation = () => {
    const { artwork } = this.props
    const { auctionState } = this.state
    const { isInAuction, isForSale } = artwork

    if (isInAuction && isForSale && auctionState !== "isLive") {
      return <AuctionPrice artwork={artwork} auctionState={auctionState as AuctionState} />
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

  componentDidMount = () => {
    const { artwork } = this.props
    const { sale } = artwork

    if (sale && sale.isAuction) {
      this.setState({
        auctionState: initialAuctionState(sale),
      })

      if (sale.isClosed) {
        return
      }

      // Set intervals to check for state changes
      if (sale.isPreview && sale.startAt) {
        this.interval = setInterval(() => {
          if (DateTime.local() > DateTime.fromISO(sale.startAt)) {
            this.setState({
              auctionState: "hasStarted",
            })
          }
        }, 1000)
      } else if (sale.liveStartAt) {
        this.interval = setInterval(() => {
          if (DateTime.local() > DateTime.fromISO(sale.liveStartAt)) {
            this.setState({
              auctionState: "isLive",
            })
          }
        }, 1000)
      } else if (sale.endAt) {
        this.interval = setInterval(() => {
          if (DateTime.local() > DateTime.fromISO(sale.endAt)) {
            this.setState({
              auctionState: "hasEnded",
            })
          }
        }, 1000)
      }
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.interval)
  }

  render() {
    const { artwork } = this.props
    const { editionSetID, auctionState } = this.state
    const { isAcquireable, isOfferable, isInquireable, isInAuction, sale, isForSale } = artwork

    const isBiddableInAuction = isInAuction && sale && auctionState !== "hasEnded" && isForSale
    const canTakeCommercialAction = isAcquireable || isOfferable || isInquireable || isBiddableInAuction
    const artistIsConsignable = artwork.artists.filter(artist => artist.isConsignable).length

    return (
      <>
        {this.renderPriceInformation()}
        <Box>
          {canTakeCommercialAction && (
            <>
              <Spacer mb={2} />
              <CommercialButtons artwork={artwork} auctionState={auctionState} editionSetID={editionSetID} />
            </>
          )}
          {isBiddableInAuction && (
            <>
              <Spacer mb={2} />
              <AuctionCountDownTimer artwork={artwork} auctionState={auctionState} />
            </>
          )}
          {(!!artistIsConsignable || isAcquireable || isOfferable || isBiddableInAuction) && (
            <>
              <Spacer mb={2} />
              <ArtworkExtraLinks artwork={artwork} auctionState={auctionState} />
            </>
          )}
        </Box>
      </>
    )
  }
}

export const CommercialInformationFragmentContainer = createFragmentContainer(CommercialInformation, {
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
      ...AuctionCountDownTimer_artwork
      ...ArtworkExtraLinks_artwork
      ...AuctionPrice_artwork
    }
  `,
})
