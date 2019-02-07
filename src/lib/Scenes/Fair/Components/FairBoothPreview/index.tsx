import { Box } from "@artsy/palette"
import { FairBoothPreview_show } from "__generated__/FairBoothPreview_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FairBoothPreviewHeader } from "./Components/FairBoothPreviewHeader"

interface Props {
  show: FairBoothPreview_show
  onViewFairBoothPressed: () => void
}

export const FairBoothPreviewContainer = createFragmentContainer<Props>(
  props => {
    const {
      show: { artworks_connection, cover_image, location, partner },
      onViewFairBoothPressed,
    } = props
    const display = !!location ? location.display : ""

    return (
      <Box my={1}>
        <FairBoothPreviewHeader
          name={partner.name}
          location={display}
          url={cover_image && cover_image.url}
          onViewFairBoothPressed={() => onViewFairBoothPressed()}
        />
        <Box mt={1}>{<GenericGrid artworks={artworks_connection.edges.map(a => a.node) as any} />}</Box>
        <Box mt={2}>
          <CaretButton
            text={
              artworks_connection.edges.length > 1
                ? `View all ${artworks_connection.edges.length} works`
                : `View 1 work`
            }
            onPress={() => onViewFairBoothPressed()}
          />
        </Box>
      </Box>
    )
  },
  graphql`
    fragment FairBoothPreview_show on Show {
      id
      name
      is_fair_booth

      partner {
        ... on Partner {
          name
          href
        }

        ... on ExternalPartner {
          name
        }
      }

      fair {
        name
      }

      cover_image {
        url
      }

      location {
        display
      }

      artworks_connection(first: 4) {
        edges {
          node {
            ...GenericGrid_artworks
          }
        }
      }
    }
  `
)
