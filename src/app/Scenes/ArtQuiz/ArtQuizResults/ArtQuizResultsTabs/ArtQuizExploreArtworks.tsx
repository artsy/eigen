import { Flex, Spinner, useSpace } from "@artsy/palette-mobile"
import { ArtQuizExploreArtworksQuery } from "__generated__/ArtQuizExploreArtworksQuery.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "app/utils/extractNodes"
import { uniqBy } from "lodash"
import { Suspense, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

const ArtQuizExploreArtworksContent = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  const space = useSpace()
  const dimensions = useScreenDimensions()

  const limit = useMemo(() => {
    if (savedArtworks.length <= 1) return 100
    if (savedArtworks.length <= 3) return 8
    return 4
  }, [savedArtworks.length])

  const queryResult = useLazyLoadQuery<ArtQuizExploreArtworksQuery>(artQuizExploreArtworksQuery, {
    limit,
  })

  const artworks = uniqBy(
    queryResult.me?.quiz.savedArtworks.flatMap((artwork) => {
      if (!artwork.layer) return []
      return extractNodes(artwork.layer.artworksConnection)
    }),
    "internalID"
  )

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

const ArtQuizExploreArtworksFallback = () => {
  const space = useSpace()
  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: space(2),
      }}
    >
      <Flex p={2} justifyContent="center" alignItems="center">
        <Spinner color="blue100" />
      </Flex>
    </StickyTabPageScrollView>
  )
}

export const ArtQuizExploreArtworks = ({
  savedArtworks,
}: {
  savedArtworks: ArtQuizResultsTabs_me$data["quiz"]["savedArtworks"]
}) => {
  return (
    <Suspense fallback={<ArtQuizExploreArtworksFallback />}>
      <ArtQuizExploreArtworksContent savedArtworks={savedArtworks} />
    </Suspense>
  )
}

const artQuizExploreArtworksQuery = graphql`
  query ArtQuizExploreArtworksQuery($limit: Int) {
    me {
      quiz {
        savedArtworks {
          layer(id: "main") {
            artworksConnection(first: $limit) {
              edges {
                node {
                  internalID
                  ...GenericGrid_artworks
                }
              }
            }
          }
        }
      }
    }
  }
`
