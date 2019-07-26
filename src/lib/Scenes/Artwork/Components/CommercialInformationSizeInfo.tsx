import { Box, Serif } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { CommercialInformationSizeInfo_piece } from "__generated__/CommercialInformationSizeInfo_piece.graphql"

export interface CommercialInformationSizeInfoProps {
  piece: CommercialInformationSizeInfo_piece
}

export class CommercialInformationSizeInfo extends React.Component<CommercialInformationSizeInfoProps> {
  render() {
    const {
      piece: { dimensions, edition_of },
    } = this.props
    if (!(edition_of && edition_of.length) && !(dimensions && (dimensions.in || dimensions.cm))) {
      return null
    }
    return (
      <Box color="black60">
        {dimensions.in && <Serif size="2">{dimensions.in}</Serif>}
        {dimensions.cm && <Serif size="2">{dimensions.cm}</Serif>}
        {edition_of && <Serif size="2">{edition_of}</Serif>}
      </Box>
    )
  }
}

export const CommercialInformationSizeInfoFragmentContainer = createFragmentContainer(CommercialInformationSizeInfo, {
  piece: graphql`
    fragment CommercialInformationSizeInfo_piece on Sellable {
      dimensions {
        in
        cm
      }
      editionOf
    }
  `,
})
