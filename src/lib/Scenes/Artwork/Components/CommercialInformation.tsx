import { Box, Sans, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import { capitalize } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { CommercialButtonsFragmentContainer as CommercialButtons } from "./CommercialButtons"
import { CommercialEditionSetInformationFragmentContainer as CommercialEditionSetInformation } from "./CommercialEditionSetInformation"

interface CommercialInformationProps {
  artwork: CommercialInformation_artwork
}

interface CommercialInformationState {
  editionSetID: string
}

export class CommercialInformation extends React.Component<CommercialInformationProps, CommercialInformationState> {
  state = {
    editionSetID: "",
  }

  renderSingleEditionWork = () => {
    const { artwork } = this.props
    const inClosedAuction = artwork.sale && artwork.sale.is_auction && artwork.sale.is_closed
    const showsSellerInfo = artwork.partner && artwork.partner.name && !inClosedAuction
    const availabilityDisplayText =
      artwork.availability &&
      (artwork.availability === "for sale" || artwork.availability === "sold" ? "Sold by" : "At")

    return (
      <Box>
        <Sans size="4t" weight="medium">
          {artwork.saleMessage ? artwork.saleMessage : capitalize(artwork.availability)}
        </Sans>
        {showsSellerInfo && (
          <>
            <Spacer mb={1} />
            <Sans size="3t" color="black60">
              {availabilityDisplayText} {artwork.partner.name}
            </Sans>
            {artwork.shippingOrigin && (
              <Sans size="3t" color="black60">
                Ships from {artwork.shippingOrigin}
              </Sans>
            )}
            {artwork.shippingInfo && (
              <Sans size="3t" color="black60">
                {artwork.shippingInfo}
              </Sans>
            )}
          </>
        )}
      </Box>
    )
  }

  renderEditionSetWork = () => {
    const { artwork } = this.props
    return (
      <CommercialEditionSetInformation
        artwork={artwork}
        setEditionSetId={editionSetID => {
          console.log("???", editionSetID)
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
    const { isAcquireable, isOfferable, isInquireable } = artwork
    const shouldRenderButtons = isAcquireable || isOfferable || isInquireable
    const consignableArtistsCount = artwork.artists.filter(artist => artist.is_consignable).length

    return (
      <>
        {artwork.editionSets && artwork.editionSets.length > 1
          ? this.renderEditionSetWork()
          : this.renderSingleEditionWork()}
        <Box>
          {shouldRenderButtons && (
            <>
              <Spacer mb={2} />
              <CommercialButtons artwork={artwork} editionSetID={editionSetID} />
            </>
          )}
          {!!consignableArtistsCount && (
            <>
              <Spacer mb={2} />
              <ArtworkExtraLinks consignableArtistsCount={consignableArtistsCount} />
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
      partner {
        name
      }
      artists {
        is_consignable: isConsignable
      }
      sale {
        is_auction: isAuction
        is_closed: isClosed
      }
      editionSets {
        isAcquireable
        isOfferable
        saleMessage
      }

      saleMessage
      shippingInfo
      shippingOrigin

      isAcquireable
      isOfferable
      isInquireable

      ...CommercialButtons_artwork
      ...CommercialEditionSetInformation_artwork
    }
  `,
})
