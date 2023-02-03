import { ArtQuizArtist_artist$key } from "__generated__/ArtQuizArtist_artist.graphql"
import { ArtQuizExploreArtists_artworks$key } from "__generated__/ArtQuizExploreArtists_artworks.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { ArtQuizArtist } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizArtist"
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
    content: <ArtQuizArtist artistData={artwork.artist as ArtQuizArtist_artist$key} />,
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
      ...ArtQuizArtist_artist
    }
  }
`
