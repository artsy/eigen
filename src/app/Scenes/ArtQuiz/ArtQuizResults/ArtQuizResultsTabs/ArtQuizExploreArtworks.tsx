import { Text, useSpace } from "@artsy/palette-mobile"
import { ArtQuizExploreArtworksFragment_artwork$key } from "__generated__/ArtQuizExploreArtworksFragment_artwork.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export const ArtQuizExploreArtworks = ({
  recommendedArtworks,
}: {
  recommendedArtworks: ArtQuizResultsTabs_me$data["quiz"]["recommendedArtworks"]
}) => {
  const space = useSpace()
  const dimensions = useScreenDimensions()

  const artworks = useFragment<ArtQuizExploreArtworksFragment_artwork$key>(
    artQuizExploreArtworksFragment,
    recommendedArtworks
  )

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space(2),
      }}
    >
      {artworks.length ? (
        <GenericGrid
          artworks={artworks}
          width={dimensions.width - space(2)}
          hidePartner
          artistNamesTextStyle={{ weight: "regular" }}
          saleInfoTextStyle={{ weight: "medium", color: "black100" }}
        />
      ) : (
        <Text variant="xs" color="black60">
          We don't have any recommendations for you at this time.
        </Text>
      )}
    </StickyTabPageScrollView>
  )
}

const artQuizExploreArtworksFragment = graphql`
  fragment ArtQuizExploreArtworksFragment_artwork on Artwork @relay(plural: true) {
    ...GenericGrid_artworks
  }
`
