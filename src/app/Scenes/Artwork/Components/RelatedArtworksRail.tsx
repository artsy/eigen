import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { Flex } from "palette"
import { graphql, useFragment } from "react-relay"

interface RelatedArtworksRailProps {
  artwork: any
}

export const RelatedArtworksRail: React.FC<RelatedArtworksRailProps> = (props) => {
  const artwork = useFragment(artworkFragment, props.artwork)

  const artworks = artwork.related

  if (!artworks) {
    return null
  }

  return (
    <Flex>
      <SectionTitle
        title="Related artworks"
        onPress={() => {
          console.warn("pressed")
        }}
      />
      <SmallArtworkRail
        artworks={artworks}
        onPress={(item) => {
          navigate(item.href!)
        }}
        ListHeaderComponent={null}
        ListFooterComponent={null}
      />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment RelatedArtworksRail_artwork on Artwork {
    internalID
    slug
    related(size: 6) {
      ...SmallArtworkRail_artworks
    }
  }
`
