import { Box, Sans } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import { ArtistListItem } from "lib/Components/ArtistListItem"
// import { capitalize } from "lodash"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork
}

export class ArtworkDetails extends React.Component<ArtworkDetailsProps> {
  render() {
    const listItems = [
      { title: "Medium", value: this.props.artwork.medium },
      {
        title: "Condition",
        value: this.props.artwork.conditionDescription ? this.props.artwork.conditionDescription.label : null,
      },
      { title: "Signature", value: this.props.artwork.signature },
      {
        title: "Certificate of Authenticity",
        value: this.props.artwork.certificateOfAuthenticity ? this.props.artwork.certificateOfAuthenticity.label : null,
      },
      { title: "Frame", value: this.props.artwork.framed ? this.props.artwork.framed.label : null },
      { title: "Series", value: this.props.artwork.series },
      { title: "Publisher", value: this.props.artwork.publisher },
      { title: "Manufacturer", value: this.props.artwork.manufacturer },
      { title: "Image rights", value: this.props.artwork.image_rights },
    ]

    const displayItems = listItems.filter(i => i.value != null)

    return (
      <Box>
        <Sans size="4" weight="medium">
          Artwork Details
        </Sans>
        {displayItems.map(i => (
          <>
            <Sans size="3" weight="medium">
              {i.title}
            </Sans>
            <Sans size="3" weight="regular">
              {i.value}
            </Sans>
          </>
        ))}
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
