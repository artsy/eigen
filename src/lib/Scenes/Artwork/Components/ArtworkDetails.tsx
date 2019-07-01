import { Box, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { LinkText } from "../../../Components/Text/LinkText"

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
      { title: "Medium", value: this.props.artwork.category },
      {
        title: "Condition",
        value: this.props.artwork.conditionDescription ? this.props.artwork.conditionDescription.label : null,
      },
      { title: "Signature", value: this.props.artwork.signature },
      {
        title: "Certificate of Authenticity",
        value: this.props.artwork.certificateOfAuthenticity && this.props.artwork.certificateOfAuthenticity.details,
      },
      { title: "Frame", value: this.props.artwork.framed && this.props.artwork.framed.details },
      { title: "Series", value: this.props.artwork.series },
      { title: "Publisher", value: this.props.artwork.publisher },
      { title: "Manufacturer", value: this.props.artwork.manufacturer },
      { title: "Image rights", value: this.props.artwork.image_rights },
    ]

    const displayItems = listItems.filter(i => i.value != null)

    let truncatedDisplayItems = displayItems

    if (!this.state.showAll && displayItems.length > 3) {
      truncatedDisplayItems = displayItems.slice(0, 3)
    }

    return (
      <Box>
        <Join separator={<Spacer my={1} />}>
          <Sans size="3" weight="medium">
            Artwork Details
          </Sans>
          {truncatedDisplayItems.map(({ title, value }, index) => (
            <React.Fragment key={index}>
              <Sans size="3" weight="regular">
                {title}
              </Sans>
              <Sans size="3" weight="regular" color="gray">
                {value}
              </Sans>
            </React.Fragment>
          ))}
          {!this.state.showAll &&
            (displayItems.length > 3 && (
              <LinkText
                onPress={() => {
                  this.setState({ showAll: true })
                }}
              >
                <Sans size="3" weight="regular">
                  Show more artwork details
                </Sans>
              </LinkText>
            ))}
        </Join>
      </Box>
    )
  }
}

export const ArtworkDetailsFragmentContainer = createFragmentContainer(ArtworkDetails, {
  artwork: graphql`
    fragment ArtworkDetails_artwork on Artwork {
      category
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
