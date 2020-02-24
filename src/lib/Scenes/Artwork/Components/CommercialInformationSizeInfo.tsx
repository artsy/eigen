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
      piece: { dimensions, editionOf },
    } = this.props
    if (!(editionOf && editionOf.length) && !(dimensions && (dimensions.in || dimensions.cm))) {
      return null
    }
    return (
      <Box color="black60">
        {dimensions.in && <Serif size="2">{dimensions.in}</Serif>}
        {dimensions.cm && <Serif size="2">{dimensions.cm}</Serif>}
        {editionOf && <Serif size="2">{editionOf}</Serif>}
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
