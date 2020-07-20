import { Flex } from "@artsy/palette"
import { ArtistSeriesHeader_artistSeries } from "__generated__/ArtistSeriesHeader_artistSeries.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistSeriesHeaderProps {
  artistSeries: ArtistSeriesHeader_artistSeries
}
export const ArtistSeriesHeader: React.SFC<ArtistSeriesHeaderProps> = ({ artistSeries }) => {
  const url = artistSeries.image?.url!

  return (
    <Flex flexDirection="row" justifyContent="center">
      <OpaqueImageView width={180} height={180} imageURL={url} />
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
