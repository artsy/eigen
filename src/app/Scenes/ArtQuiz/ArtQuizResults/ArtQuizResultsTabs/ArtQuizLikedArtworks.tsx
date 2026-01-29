import { Tabs, useSpace } from "@artsy/palette-mobile"
import { ArtQuizLikedArtworks_artworks$key } from "__generated__/ArtQuizLikedArtworks_artworks.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { graphql, useFragment } from "react-relay"

export const ArtQuizLikedArtworks = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  const artworks = useFragment<ArtQuizLikedArtworks_artworks$key>(
    artQuizLikedArtworksFragment,
    savedArtworks
  )

  const space = useSpace()

  return (
    <Tabs.ScrollView
      contentContainerStyle={{
        paddingBottom: space(4),
        paddingHorizontal: space(1),
      }}
    >
      <GenericGrid
        artworks={artworks}
        hidePartner
        artistNamesTextStyle={{ weight: "regular" }}
        saleInfoTextStyle={{ weight: "medium", color: "mono100" }}
      />
    </Tabs.ScrollView>
  )
}

const artQuizLikedArtworksFragment = graphql`
  fragment ArtQuizLikedArtworks_artworks on Artwork @relay(plural: true) {
    ...GenericGrid_artworks
  }
`
