import { Box, Sans } from "@artsy/palette"
import { SellerInfo_artwork } from "__generated__/SellerInfo_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SellerInfoProps {
  artwork: SellerInfo_artwork
}

export class SellerInfo extends React.Component<SellerInfoProps> {
  render() {
    const { partner, availability } = this.props.artwork
    const { name } = partner
    const availabilityDisplayText = availability === "for sale" || availability === "sold" ? "Sold by" : "At"

    return (
      <Box>
        {name && (
          <Sans size="3t" color="black60">
            {availabilityDisplayText} {name}
          </Sans>
        )}
      </Box>
    )
  }
}

export const SellerInfoFragmentContainer = createFragmentContainer(SellerInfo, {
  artwork: graphql`
    fragment SellerInfo_artwork on Artwork {
      availability
      partner {
        name
      }
    }
  `,
})
