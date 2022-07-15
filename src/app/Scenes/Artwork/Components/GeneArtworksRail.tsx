import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { Flex } from "palette"
import { graphql, useFragment } from "react-relay"

interface GeneArtworksRailProps {
  viewer: any
  artistID: string
  geneID: string
  title: string
}

export const GeneArtworksRail: React.FC<GeneArtworksRailProps> = (props) => {
  const artworks = useFragment(artworkFragment, props.viewer)

  if (!artworks) {
    return null
  }

  return (
    <Flex>
      <SectionTitle
        title={props.title}
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
  fragment GeneArtworksRail_viewer on Viewer
  @argumentDefinitions(geneID: { type: "String" }, artistID: { type: "String" }) {
    artworksConnection(first: 6, geneID: $geneID, artistID: $artistID) {
      edges {
        node {
          ...SmallArtworkRail_artworks
        }
      }
    }
  }
`
