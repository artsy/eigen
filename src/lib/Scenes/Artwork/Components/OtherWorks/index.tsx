import { OtherWorks_artwork } from "__generated__/OtherWorks_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkContextArtistFragmentContainer as ArtworkContextArtist } from "./ArtworkContexts/ArtworkContextArtist"

export const OtherWorksFragmentContainer = createFragmentContainer<{
  artwork: OtherWorks_artwork
}>(
  props => {
    const contextType = props.artwork.context && props.artwork.context.__typename

    switch (contextType) {
      // when we add other contexts this switch case makes more sense
      case "ArtworkContextAuction": {
        return null
      }
      case "ArtworkContextFair": {
        return null
      }
      case "ArtworkContextPartnerShow": {
        return null
      }
      default: {
        return <ArtworkContextArtist artwork={props.artwork} />
      }
    }
  },
  {
    artwork: graphql`
      fragment OtherWorks_artwork on Artwork {
        id
        context {
          __typename
        }
        ...ArtworkContextArtist_artwork
      }
    `,
  }
)
