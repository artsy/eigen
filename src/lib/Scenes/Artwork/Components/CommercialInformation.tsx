import { Box, Sans, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import { capitalize } from "lodash"
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

interface CommercialInformationState {
  editionSetID: string
}

export class CommercialInformation extends React.Component<CommercialInformationProps, CommercialInformationState> {
  state = {
    editionSetID: null,
  }

  renderSingleEditionArtwork = () => {
    const { artwork } = this.props
    let saleMessage
    if (artwork.isInAuction && artwork.sale && artwork.sale.isClosed) {
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
    const { isInAuction, isForSale } = artwork

    if (isInAuction && isForSale) {
      return <AuctionPrice artwork={artwork} />
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
    const { artwork } = this.props
    const { editionSetID } = this.state
    const { isAcquireable, isOfferable, isInquireable, isInAuction, sale, isForSale } = artwork

    const isBiddableInAuction = isInAuction && sale && !sale.isClosed && isForSale
    const canTakeCommercialAction = isAcquireable || isOfferable || isInquireable || isBiddableInAuction
    const artistIsConsignable = artwork.artists.filter(artist => artist.isConsignable).length

    return (
      <>
        {this.renderPriceInformation()}
        <Box>
          {canTakeCommercialAction && (
            <>
              <Spacer mb={2} />
              <CommercialButtons artwork={artwork} editionSetID={editionSetID} />
            </>
          )}
          {isBiddableInAuction && (
            <>
              <Spacer mb={2} />
              <AuctionCountDownTimer artwork={artwork} />
            </>
          )}
          {(!!artistIsConsignable || isAcquireable || isOfferable || isBiddableInAuction) && (
            <>
              <Spacer mb={2} />
              <ArtworkExtraLinks artwork={artwork} />
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
