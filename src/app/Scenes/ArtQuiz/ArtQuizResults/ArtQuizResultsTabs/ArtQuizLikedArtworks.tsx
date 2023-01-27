import { ArtQuizLikedArtworks_me$key } from "__generated__/ArtQuizLikedArtworks_me.graphql"
import { ArtQuizResultLoaderQuery$data } from "__generated__/ArtQuizResultLoaderQuery.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useSpace } from "palette"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export const ArtQuizLikedArtworks = ({ me }: { me: ArtQuizResultLoaderQuery$data["me"] }) => {
  const artworks = useFragment<ArtQuizLikedArtworks_me$key>(artQuizLikedArtworksFragment, me)?.quiz
    .savedArtworks

  const space = useSpace()
  const dimensions = useScreenDimensions()

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space(2),
      }}
    >
      <GenericGrid
        artworks={artworks!}
        width={dimensions.width - space(2)}
        hidePartner
        artistNamesTextStyle={{ weight: "regular" }}
        saleInfoTextStyle={{ weight: "medium", color: "black100" }}
      />
    </StickyTabPageScrollView>
  )
}

const artQuizLikedArtworksFragment = graphql`
  fragment ArtQuizLikedArtworks_me on Me {
    quiz {
      savedArtworks {
        ...GenericGrid_artworks
      }
    }
  }
`
