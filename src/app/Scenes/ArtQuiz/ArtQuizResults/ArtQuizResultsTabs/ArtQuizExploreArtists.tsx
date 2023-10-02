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
      key="ArtQuizExplorArtists"
      data={artworks}
      initialNumToRender={2}
      renderItem={({ item }) => {
        return <ArtQuizArtist artistData={item.artist} />
      }}
      keyExtractor={(item) => item.internalID as string}
    />
  )
}

const artQuizExploreArtistsFragment = graphql`
  fragment ArtQuizExploreArtists_artworks on Artwork @relay(plural: true) {
    internalID
    artist {
      internalID
      ...ArtQuizArtist_artist
    }
  }
`
