import { Box, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkDetails_artwork } from "__generated__/ArtworkDetails_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { truncatedTextLimit } from "../hardware"
import { RequestConditionReportQueryRenderer } from "./RequestConditionReport"

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
    const { artwork } = this.props

    const listItems = [
      { title: "Medium", value: artwork.category },
      {
        title: "Condition",
        value: artwork.isBiddable && artwork.conditionDescription ? artwork.conditionDescription.details : null,
      },
      {
        title: "Condition",
        value: this.props.artwork.isBiddable ? <RequestConditionReportQueryRenderer artworkID={artwork.slug} /> : null,
      },
      { title: "Signature", value: artwork.signatureInfo && artwork.signatureInfo.details },
      {
        title: "Certificate of Authenticity",
        value: artwork.certificateOfAuthenticity && artwork.certificateOfAuthenticity.details,
      },
      { title: "Frame", value: artwork.framed && artwork.framed.details },
      { title: "Series", value: artwork.series },
      { title: "Publisher", value: artwork.publisher },
      { title: "Manufacturer", value: artwork.manufacturer },
      { title: "Image rights", value: artwork.image_rights },
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
              {React.isValidElement(value) ? (
                value
              ) : (
                <ReadMore
                  content={value}
                  color="black60"
                  sans
                  maxChars={truncatedTextLimit()}
                  trackingFlow={Schema.Flow.ArtworkDetails}
                  contextModule={Schema.ContextModules.ArtworkDetails}
                />
              )}
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
      slug
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
      isBiddable
      saleArtwork {
        internalID
      }
    }
  `,
})
