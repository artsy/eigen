import { ArtQuizLikedArtworksQuery } from "__generated__/ArtQuizLikedArtworksQuery.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useSpace } from "palette"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export const ArtQuizLikedArtworks = () => {
  const artworks = useLazyLoadQuery<ArtQuizLikedArtworksQuery>(artQuizLikedArtworksQuery, {}).me
    ?.quiz.savedArtworks

  const space = useSpace()
  const dimensions = useScreenDimensions()

  if (!artworks) {
    return null
  }

  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space(2),
      }}
    >
      <GenericGrid
        artworks={artworks}
        width={dimensions.width - space(2)}
        hidePartner
        artistNamesTextStyle={{ weight: "regular" }}
        saleInfoTextStyle={{ weight: "medium", color: "black100" }}
      />
    </StickyTabPageScrollView>
  )
}

const artQuizLikedArtworksQuery = graphql`
  query ArtQuizLikedArtworksQuery {
    me {
      quiz {
        savedArtworks {
          ...GenericGrid_artworks
        }
      }
    }
  }
`
