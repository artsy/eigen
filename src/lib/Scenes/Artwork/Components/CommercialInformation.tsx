import { Box, Sans, Spacer } from "@artsy/palette"
import { CommercialInformation_artwork } from "__generated__/CommercialInformation_artwork.graphql"
import { capitalize } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkExtraLinks } from "./ArtworkExtraLinks"
import { AuctionCountDownTimerFragmentContainer as AuctionCountDownTimer } from "./AuctionCountDownTimer"
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

  renderSingleEditionWork = () => {
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

  renderEditionSetWork = () => {
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
    const shouldRenderButtons = isAcquireable || isOfferable || isInquireable
    const consignableArtistsCount = artwork.artists.filter(artist => artist.isConsignable).length
    const artistName = artwork.artists && artwork.artists.length === 1 ? artwork.artists[0].name : null

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
          {isInAuction &&
            sale &&
            !sale.isClosed && (
              <>
                <Spacer mb={2} />
                <AuctionCountDownTimer artwork={artwork} />
              </>
            )}
          {!!consignableArtistsCount ||
            (true && (
              <>
                <Spacer mb={2} />
                <ArtworkExtraLinks
                  artworkSlug={slug}
                  isAcquireable={isAcquireable}
                  isInquireable={isInquireable}
                  consignableArtistsCount={consignableArtistsCount}
                  artistName={artistName}
                />
              </>
            ))}
        </Box>
      </>
    )
  }
}

export const CommercialInformationFragmentContainer = createFragmentContainer(CommercialInformation, {
  artwork: graphql`
    fragment CommercialInformation_artwork on Artwork {
      slug
      availability
      artists {
        isConsignable
        name
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
    }
  `,
})
