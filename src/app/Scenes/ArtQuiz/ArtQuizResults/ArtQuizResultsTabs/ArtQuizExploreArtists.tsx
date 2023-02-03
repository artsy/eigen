import { ArtQuizExploreArtists_artworks$key } from "__generated__/ArtQuizExploreArtists_artworks.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtQuizExploreArtist } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizExploreArtist"
import { graphql, useFragment } from "react-relay"

export const ArtQuizExploreArtists = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  const artworks = useFragment<ArtQuizExploreArtists_artworks$key>(
    artQuizExploreArtistsFragment,
    savedArtworks
  )

  const artworkSections = artworks.map((artwork) => ({
    key: artwork.artist?.internalID!,
    content: <ArtQuizExploreArtist artistData={artwork.artist} />,
  }))

  return (
    <StickyTabPageFlatList
      style={{ paddingHorizontal: 0 }}
      data={artworkSections}
      initialNumToRender={2}
      keyExtractor={(item, index) => String(item?.artist?.internalID || index)}
    />
  )
}

const artQuizExploreArtistsFragment = graphql`
  fragment ArtQuizExploreArtists_artworks on Artwork @relay(plural: true) {
    artist {
      internalID
      ...ArtQuizExploreArtist_artist
    }
  }
`
