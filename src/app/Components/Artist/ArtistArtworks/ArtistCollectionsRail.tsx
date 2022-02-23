import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import { ArtistCollectionsRail_artist } from "__generated__/ArtistCollectionsRail_artist.graphql"
import { GenericArtistSeriesRail } from "app/Components/GenericArtistSeriesRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { Schema } from "app/utils/track"
import { Box } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistCollectionsRailProps {
  collections: ArtistAbout_artist["iconicCollections"]
  artist: ArtistCollectionsRail_artist
}

export const ArtistCollectionsRail: React.FC<ArtistCollectionsRailProps> = (props) => {
  const { artist, collections } = props

  if (collections && collections.length > 1) {
    return (
      <Box>
        <SectionTitle title="Iconic Collections" />
        <ArtistSeriesRailWrapper>
          <GenericArtistSeriesRail
            collections={collections}
            contextScreenOwnerType={Schema.OwnerEntityTypes.Artist}
            contextScreenOwnerId={artist.internalID}
            contextScreenOwnerSlug={artist.slug}
          />
        </ArtistSeriesRailWrapper>
      </Box>
    )
  }
  return null
}

const ArtistSeriesRailWrapper = styled(Box)`
  margin: 0 -20px 20px -40px;
`

export const ArtistCollectionsRailFragmentContainer = createFragmentContainer(
  ArtistCollectionsRail,
  {
    artist: graphql`
      fragment ArtistCollectionsRail_artist on Artist {
        internalID
        slug
      }
    `,

    collections: graphql`
      fragment ArtistCollectionsRail_collections on MarketingCollection @relay(plural: true) {
        slug
        id
        title
        priceGuidance
        artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
          edges {
            node {
              title
              image {
                url
              }
            }
          }
        }
      }
    `,
  }
)
