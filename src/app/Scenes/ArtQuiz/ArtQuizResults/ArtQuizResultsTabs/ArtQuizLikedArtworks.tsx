import { ArtQuizLikedArtworks_me$key } from "__generated__/ArtQuizLikedArtworks_me.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useSpace } from "palette"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export const ArtQuizLikedArtworks = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  const artworks = useFragment<ArtQuizLikedArtworks_me$key>(
    artQuizLikedArtworksFragment,
    savedArtworks
  )

  const space = useSpace()
  const dimensions = useScreenDimensions()

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space("2"),
      }}
    >
      <GenericGrid
        artworks={artworks}
        width={dimensions.width - space("2")}
        hidePartner
        artistNamesTextStyle={{ weight: "regular" }}
        saleInfoTextStyle={{ weight: "medium", color: "black100" }}
      />
    </StickyTabPageScrollView>
  )
}

const artQuizLikedArtworksFragment = graphql`
  fragment ArtQuizLikedArtworks_me on Artwork @relay(plural: true) {
    ...GenericGrid_artworks
  }
`
