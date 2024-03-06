import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { NewWorksForYouArtworksQuery } from "__generated__/NewWorksForYouArtworksQuery.graphql"
import { NewWorksForYouArtworks_viewer$key } from "__generated__/NewWorksForYouArtworks_viewer.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import {
  NewWorksForYouPlaceholder,
  NewWorksForYouScreenProps,
  PAGE_SIZE,
} from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useViewOptionNumColumns } from "app/utils/masonryHelpers/viewOptionHelpers"
import { pluralize } from "app/utils/pluralize"
import { useLayoutEffect, useRef, useState } from "react"
import { LayoutAnimation } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface NewWorksForYouProps {
  viewer: NewWorksForYouArtworks_viewer$key
}

export const NewWorksForYouArtworks: React.FC<NewWorksForYouProps> = ({ viewer }) => {
  const numColumns = useViewOptionNumColumns("onyx_new_works_for_you_feed")
  const { data } = usePaginationFragment(newWorksForYouArtworksFragment, viewer)
  const { scrollHandler } = Screen.useListenForScreenScroll()
  const artworks = extractNodes(data.artworks)

  const [hasChangedLayout, setHasChangedLayout] = useState(false)

  const firstUpdate = useRef(true)

  // This is a hack to force the grid to re-render when the layout changes
  // Flashlist makes a werid animation when changing between numColumns
  // We avoid it by showing the placeholder for a second while it's happening
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    setHasChangedLayout(true)
  }, [numColumns])

  if (hasChangedLayout) {
    setTimeout(() => {
      setHasChangedLayout(false)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }, 1000)

    return <NewWorksForYouPlaceholder />
  }

  return (
    <Flex style={{ height: "100%" }}>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
        numColumns={numColumns}
        pageSize={PAGE_SIZE}
        contextScreenOwnerType={OwnerType.newWorksForYou}
        contextScreen={OwnerType.newWorksForYou}
        ListEmptyComponent={
          <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
        }
        ListHeaderComponent={() => (
          // We need padding when the grid is full width
          <Flex px={numColumns === 1 ? 2 : 0}>
            <Text variant="lg-display">New Works for You</Text>
            <Text variant="xs" pt={2}>
              {artworks.length} {pluralize("Artwork", artworks.length)}
            </Text>
          </Flex>
        )}
        hasMore={false}
        onScroll={scrollHandler}
        style={{ paddingBottom: 120 }}
      />
    </Flex>
  )
}

export const newWorksForYouArtworksFragment = graphql`
  fragment NewWorksForYouArtworks_viewer on Viewer
  @refetchable(queryName: "NewWorksForYouArtworks_viewerRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 100 }
    cursor: { type: "String" }
    version: { type: "String" }
    maxWorksPerArtist: { type: "Int" }
  ) {
    artworks: artworksForUser(
      after: $cursor
      first: $count
      includeBackfill: true
      maxWorksPerArtist: $maxWorksPerArtist
      version: $version
    ) @connection(key: "NewWorksForYou_artworks") {
      totalCount
      edges {
        node {
          id
          slug
          href
          image(includeAll: false) {
            aspectRatio
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`

export const newWorksForYouArtworksQuery = graphql`
  query NewWorksForYouArtworksQuery($version: String, $maxWorksPerArtist: Int) {
    viewer @principalField {
      ...NewWorksForYouArtworks_viewer
        @arguments(version: $version, maxWorksPerArtist: $maxWorksPerArtist)
    }
  }
`

export const NewWorksForYouArtworksQR: React.FC<NewWorksForYouScreenProps> = withSuspense(
  ({ version, maxWorksPerArtist }) => {
    const data = useLazyLoadQuery<NewWorksForYouArtworksQuery>(newWorksForYouArtworksQuery, {
      version,
      maxWorksPerArtist,
    })

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.viewer) {
      return <Text>Something went wrong.</Text>
    }

    return <NewWorksForYouArtworks viewer={data.viewer} />
  },
  () => <NewWorksForYouPlaceholder defaultViewOption="grid" />
)
