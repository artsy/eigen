import { LazyGeneRailQuery } from "__generated__/LazyGeneRailQuery.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface LazyGeneRailProps {
  title: string
  geneID: string
  artistID: string
}

export const LazyGeneRail: React.FC<LazyGeneRailProps> = ({ title, geneID, artistID }) => {
  const data = useLazyLoadQuery<LazyGeneRailQuery>(
    graphql`
      query LazyGeneRailQuery($geneID: String, $artistID: String) {
        artworksConnection(first: 6, artistID: $artistID, geneID: $geneID) {
          edges {
            node {
              ...SmallArtworkRail_artworks
            }
          }
        }
      }
    `,
    {
      geneID,
      artistID,
    }
  )

  const artworks = extractNodes(data.artworksConnection)

  return (
    <Suspense fallback={<Text>yolo loading</Text>}>
      <Flex>
        <SectionTitle
          title={title}
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
    </Suspense>
  )
}
