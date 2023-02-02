import { ArtQuizTrendingCollection_collection$key } from "__generated__/ArtQuizTrendingCollection_collection.graphql"
import { ArtQuizTrendingCollections_viewer$data } from "__generated__/ArtQuizTrendingCollections_viewer.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spacer, Text } from "palette"
import { graphql, useFragment } from "react-relay"

export const ArtQuizTrendingCollection = ({
  collectionData,
}: {
  collectionData: ArtQuizTrendingCollections_viewer$data
}) => {
  const collection = useFragment<ArtQuizTrendingCollection_collection$key>(
    artQuizTrendingCollectionFragment,
    collectionData
  )

  const artworks = extractNodes(collection?.artworksConnection)

  if (artworks.length === 0) return null

  return (
    <Flex pt={2}>
      <Flex px={2}>
        <Text variant="sm">{collection?.title}</Text>
        <Text variant="sm" color="black60">
          {collection?.description}
        </Text>
      </Flex>
      <Spacer m={1} />
      <SmallArtworkRail
        artworks={artworks}
        onPress={(artwork) => {
          navigate(artwork?.href!)
        }}
      />
    </Flex>
  )
}

const artQuizTrendingCollectionFragment = graphql`
  fragment ArtQuizTrendingCollection_collection on MarketingCollection {
    title
    description
    artworksConnection(first: 16) {
      edges {
        node {
          ...SmallArtworkRail_artworks
        }
      }
    }
  }
`

// const FollowArtistMutation = graphql`
//   mutation ArtQuizExploreArtistFollowArtistMutation($input: FollowArtistInput!) {
//     followArtist(input: $input) {
//       artist {
//         id
//         isFollowed
//       }
//     }
//   }
// `
