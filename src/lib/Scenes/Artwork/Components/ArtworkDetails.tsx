import { Box, Sans } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
// import { capitalize } from "lodash"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork
}

export class ArtworkDetails extends React.Component<ArtworkDetailsProps> {
  render() {
    return (
      <Box>
        <Text>Artwork Details</Text>
        <Text>Medium</Text>
        <Text>{this.props.artwork.medium}</Text>
        <Text>Condition</Text>
        <Text>{JSON.stringify(this.props.artwork.conditionDescription)}</Text>
        <Text>Signature</Text>
        <Text>{JSON.stringify(this.props.artwork.signature)}</Text>
        <Text>Certificate of Authenticity</Text>
        <Text>{JSON.stringify(this.props.artwork.certificateOfAuthenticity)}</Text>
        <Text>Frame</Text>
        <Text>{JSON.stringify(this.props.artwork.framed)}</Text>
        <Text>Series</Text>
        <Text>{JSON.stringify(this.props.artwork.series)}</Text>
        <Text>Publisher</Text>
        <Text>{JSON.stringify(this.props.artwork.publisher)}</Text>
        <Text>Manufacturer</Text>
        <Text>{JSON.stringify(this.props.artwork.manufacturer)}</Text>
        <Text>Image rights</Text>
        <Text>{JSON.stringify(this.props.artwork.image_rights)}</Text>
      </Box>
    )
  }
}

export const ArtworkDetailsFragmentContainer = createFragmentContainer(ArtworkDetails, {
  artwork: graphql`
    fragment ArtworkDetails_artwork on Artwork {
      medium
      conditionDescription {
        label
        details
      }
      signature(format: PLAIN)
      signatureInfo {
        label
        details
      }
      certificateOfAuthenticity {
        label
        details
      }
      framed {
        label
        details
      }
      series(format: PLAIN)
      publisher(format: PLAIN)
      manufacturer(format: PLAIN)
      image_rights
    }
  `,
})
