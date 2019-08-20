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
    const saleMessage = artwork.saleMessage === "Contact For Price" ? "Contact for price" : artwork.saleMessage

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
    const { isInAuction, sale } = artwork
    const showAuctionFlow = isInAuction && sale && !sale.isClosed
    if (showAuctionFlow) {
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
    const { isAcquireable, isOfferable, isInquireable, isInAuction, sale } = artwork
    const showAuctionFlow = isInAuction && sale && !sale.isClosed
    const shouldRenderButtons = isAcquireable || isOfferable || isInquireable || showAuctionFlow
    const consignableArtistsCount = artwork.artists.filter(artist => artist.isConsignable).length

    return (
      <>
        {this.renderPriceInformation()}
        <Box>
          {shouldRenderButtons && (
            <>
              <Spacer mb={2} />
              <CommercialButtons artwork={artwork} editionSetID={editionSetID} />
            </>
          )}
          {showAuctionFlow && (
            <>
              <Spacer mb={2} />
              <AuctionCountDownTimer artwork={artwork} />
            </>
          )}
          {(!!consignableArtistsCount || isAcquireable || isInquireable) && (
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
      availability

      artists {
        isConsignable
      }

      editionSets {
        isAcquireable
        isOfferable
        saleMessage
      }

      sale {
        isClosed
      }

      saleMessage
      shippingInfo
      shippingOrigin

      isAcquireable
      isOfferable
      isInquireable
      isInAuction

      ...CommercialButtons_artwork
      ...CommercialPartnerInformation_artwork
      ...CommercialEditionSetInformation_artwork
      ...AuctionCountDownTimer_artwork
      ...ArtworkExtraLinks_artwork
      ...AuctionPrice_artwork
    }
  `,
})
