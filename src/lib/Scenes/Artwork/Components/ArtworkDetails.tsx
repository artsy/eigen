import { Box, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import React from "react"
import { Button } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork
}

interface ArtworkDetailsState {
  showAll: boolean
}

export class ArtworkDetails extends React.Component<ArtworkDetailsProps, ArtworkDetailsState> {
  state = { showAll: false }

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
        value: this.props.artwork.certificateOfAuthenticity ? "Included" : "Not Included",
      },
      { title: "Frame", value: this.props.artwork.framed ? "Included" : "Not Included" },
      { title: "Series", value: this.props.artwork.series },
      { title: "Publisher", value: this.props.artwork.publisher },
      { title: "Manufacturer", value: this.props.artwork.manufacturer },
      { title: "Image rights", value: this.props.artwork.image_rights },
    ]

    let displayItems = listItems.filter(i => i.value != null)

    if (!this.state.showAll && displayItems.length > 3) {
      displayItems = displayItems.slice(0, 3)
    }

    return (
      <Box>
        <Join separator={<Spacer my={1} />}>
          <Sans size="3" weight="medium">
            Artwork Details
          </Sans>
          {displayItems.map(i => (
            <>
              <Sans size="3" weight="regular">
                {i.title}
              </Sans>
              <Sans size="3" weight="regular" color="gray">
                {i.value}
              </Sans>
            </>
          ))}
          {!this.state.showAll && (
            <Sans
              size="3"
              weight="regular"
              onPress={() => {
                this.setState({ showAll: true })
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Show more artwork details
            </Sans>
          )}
        </Join>
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
      signature
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
      series
      publisher
      manufacturer
      image_rights
    }
  `,
})
