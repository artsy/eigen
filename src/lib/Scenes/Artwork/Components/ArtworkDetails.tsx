import { Box, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { truncatedTextLimit } from "../hardware"

interface ArtworkDetailsProps {
  artwork: ArtworkDetails_artwork
}

@track()
export class ArtworkDetails extends React.Component<ArtworkDetailsProps> {
  @track(() => ({
    action_name: Schema.ActionNames.ShowMoreArtworksDetails,
    action_type: Schema.ActionTypes.Tap,
    flow: Schema.Flow.ArtworkDetails,
    context_module: Schema.ContextModules.ArtworkDetails,
  }))
  render() {
    const listItems = [
      { title: "Medium", value: this.props.artwork.category },
      {
        title: "Condition",
        value: this.props.artwork.conditionDescription ? this.props.artwork.conditionDescription.details : null,
      },
      { title: "Signature", value: this.props.artwork.signatureInfo && this.props.artwork.signatureInfo.details },
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

    const displayItems = listItems.filter(i => i.value != null && i.value !== "")

    return (
      <Box>
        <Join separator={<Spacer my={1} />}>
          <Sans size="3t" weight="medium">
            Artwork details
          </Sans>
          {displayItems.map(({ title, value }, index) => (
            <React.Fragment key={index}>
              <Sans size="3t" weight="regular">
                {title}
              </Sans>
              <ReadMore
                content={value}
                color="black60"
                sans
                maxChars={truncatedTextLimit()}
                trackingFlow={Schema.Flow.ArtworkDetails}
                contextModule={Schema.ContextModules.ArtworkDetails}
              />
            </React.Fragment>
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
      image_rights: imageRights
    }
  `,
})
