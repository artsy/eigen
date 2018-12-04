import { Box, Separator } from "@artsy/palette"
import { FairBooth_show } from "__generated__/FairBooth_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { FairBoothHeader } from "./Components/FairBoothHeader"

interface Props {
  show: FairBooth_show
}

export const FairBoothContainer = createFragmentContainer<Props>(
  props => {
    const {
      show: { artworks_connection, cover_image, location, partner },
    } = props

    const display = !!location ? location.display : ""
    return (
      <Box my={1}>
        <Separator mb={1} />
        <FairBoothHeader name={partner.name} location={display} url={cover_image.url} />
        <Box mt={1}>{<GenericGrid artworks={artworks_connection.edges.map(a => a.node) as any} />}</Box>
      </Box>
    )
  },
  graphql`
    fragment FairBooth_show on Show {
      id
      name
      is_fair_booth

      partner {
        ... on Partner {
          name
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
