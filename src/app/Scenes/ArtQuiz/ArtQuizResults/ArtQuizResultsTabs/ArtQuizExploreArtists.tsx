import { Tabs } from "@artsy/palette-mobile"
import { ArtQuizExploreArtists_artworks$key } from "__generated__/ArtQuizExploreArtists_artworks.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"

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

  return (
    <Tabs.FlatList
      data={artworks}
      initialNumToRender={2}
      renderItem={({ item }) => {
        return <ArtQuizArtist artistData={item.artist} />
      }}
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
