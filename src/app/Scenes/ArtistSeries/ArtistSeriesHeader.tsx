import { ArtistSeriesHeader_artistSeries$data } from "__generated__/ArtistSeriesHeader_artistSeries.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistSeriesHeaderProps {
  artistSeries: ArtistSeriesHeader_artistSeries$data
}
export const ArtistSeriesHeader: React.FC<ArtistSeriesHeaderProps> = ({ artistSeries }) => {
  const url = artistSeries.image?.url!

  return (
    <Flex flexDirection="row" justifyContent="center" pt={1}>
      <OpaqueImageView
        width={180}
        height={180}
        imageURL={url}
        style={{ borderRadius: 2, overflow: "hidden" }}
      />
    </Flex>
  )
}

export const ArtistSeriesHeaderFragmentContainer = createFragmentContainer(ArtistSeriesHeader, {
  artistSeries: graphql`
    fragment ArtistSeriesHeader_artistSeries on ArtistSeries {
      image {
        url
      }
    }
  `,
})
