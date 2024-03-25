import { Flex } from "@artsy/palette-mobile"
import { ArtistSeriesHeader_artistSeries$data } from "__generated__/ArtistSeriesHeader_artistSeries.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistSeriesHeaderProps {
  artistSeries: ArtistSeriesHeader_artistSeries$data
}
export const ArtistSeriesHeader: React.FC<ArtistSeriesHeaderProps> = ({ artistSeries }) => {
  const url = artistSeries.image?.url

  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      pt={1}
      width={180}
      height={180}
      borderRadius={2}
      overflow="hidden"
    >
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
