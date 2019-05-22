import { Box, Sans } from "@artsy/palette"
import { SellerInfo_artwork } from "__generated__/SellerInfo_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SellerInfoProps {
  artwork: SellerInfo_artwork
}

export class SellerInfo extends React.Component<SellerInfoProps> {
  render() {
    return (
      <Box>
        <Sans size="3">{this.props.artwork.partner.name}</Sans>
      </Box>
    )
  }
}

export const SellerInfoFragmentContainer = createFragmentContainer(SellerInfo, {
  artwork: graphql`
    fragment SellerInfo_artwork on Artwork {
      partner {
        name
      }
    }
  `,
})
