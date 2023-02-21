import { Flex, Spinner, Text } from "@artsy/palette-mobile"
import { ArtQuizExploreArtworksQuery } from "__generated__/ArtQuizExploreArtworksQuery.graphql"
import { ArtQuizResultsTabs_me$data } from "__generated__/ArtQuizResultsTabs_me.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { useIsStaging } from "app/store/GlobalStore"
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
        paddingVertical: 20,
      }}
    >
      <GenericGrid
        artworks={artworks}
        width={dimensions.width - 20}
        hidePartner
        artistNamesTextStyle={{ weight: "regular" }}
        saleInfoTextStyle={{ weight: "medium", color: "black100" }}
      />
    </StickyTabPageScrollView>
  )
}

const ArtQuizExploreArtworksFallback = () => {
  return (
    <StickyTabPageScrollView
      contentContainerStyle={{
        paddingVertical: 20,
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
  const isStaging = useIsStaging()

  if (isStaging) {
    return (
      <StickyTabPageScrollView
        contentContainerStyle={{
          paddingVertical: 20,
        }}
      >
        <Text variant="xs" color="black60">
          We don't have any recommendations for you at this time.
        </Text>
      </StickyTabPageScrollView>
    )
  }

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
