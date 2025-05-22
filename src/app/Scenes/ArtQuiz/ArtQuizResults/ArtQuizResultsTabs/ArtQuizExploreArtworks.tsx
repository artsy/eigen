import { Tabs, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtQuizExploreArtworksFragment_artwork$key } from "__generated__/ArtQuizExploreArtworksFragment_artwork.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"

import { graphql, useFragment } from "react-relay"

export const ArtQuizExploreArtworks = ({
  recommendedArtworks,
}: {
  recommendedArtworks: ArtQuizResultsTabs_me$data["quiz"]["recommendedArtworks"]
}) => {
  const space = useSpace()

  const artworks = useFragment<ArtQuizExploreArtworksFragment_artwork$key>(
    artQuizExploreArtworksFragment,
    recommendedArtworks
  )

  const dimensions = useScreenDimensions()

  return (
    <Tabs.ScrollView
      contentContainerStyle={{
        marginVertical: space(2),
        paddingBottom: space(4),
        paddingHorizontal: space(1),
      }}
    >
      {artworks.length ? (
        <GenericGrid
          artworks={artworks}
          width={dimensions.width}
          hidePartner
          artistNamesTextStyle={{ weight: "regular" }}
          saleInfoTextStyle={{ weight: "medium", color: "mono100" }}
        />
      ) : (
        <Text variant="xs" color="mono60" textAlign="center">
          We don't have any recommendations for you at this time.
        </Text>
      )}
    </Tabs.ScrollView>
  )
}

const artQuizExploreArtworksFragment = graphql`
  fragment ArtQuizExploreArtworksFragment_artwork on Artwork @relay(plural: true) {
    ...GenericGrid_artworks
  }
`
