import { OwnerType } from "@artsy/cohesion"
import { Flex, SimpleMessage, Text } from "@artsy/palette-mobile"
import { NewWorksForYouGridQuery } from "__generated__/NewWorksForYouGridQuery.graphql"
import { NewWorksForYouGrid_viewer$key } from "__generated__/NewWorksForYouGrid_viewer.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { NewWorksForYouHeaderComponent } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouHeader"
import {
  NewWorksForYouPlaceholder,
  NewWorksForYouScreenProps,
  PAGE_SIZE,
} from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import { Animated, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface NewWorksForYouProps {
  viewer: NewWorksForYouGrid_viewer$key
}

export const NewWorksForYouGrid: React.FC<NewWorksForYouProps> = ({ viewer }) => {
  const { data } = usePaginationFragment(newWorksForYouGridFragment, viewer)

  const artworks = extractNodes(data.artworks)

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flexDirection="row" pt={0.5}>
        <Text variant="sm" numberOfLines={1} style={{ flexShrink: 1 }} textAlign="center">
          New Works For You
        </Text>
      </Flex>
    ),
  })

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <SafeAreaView edges={["top"]} style={{ minHeight: Dimensions.get("screen").height }}>
        <Animated.ScrollView
          style={{ minHeight: Dimensions.get("screen").height }}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          {...scrollProps}
        >
          <Flex style={{ minHeight: Dimensions.get("screen").height }}>
            <MasonryInfiniteScrollArtworkGrid
              nestedScrollEnabled={true}
              artworks={artworks}
              disableAutoLayout
              pageSize={PAGE_SIZE}
              contextScreenOwnerType={OwnerType.newWorksForYou}
              contextScreen={OwnerType.newWorksForYou}
              ListEmptyComponent={
                <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
              }
              ListHeaderComponent={() => (
                <NewWorksForYouHeaderComponent artworksCount={artworks.length} />
              )}
              hasMore={false}
            />
          </Flex>
        </Animated.ScrollView>
        {headerElement}
      </SafeAreaView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const newWorksForYouGridFragment = graphql`
  fragment NewWorksForYouGrid_viewer on Viewer
  @refetchable(queryName: "NewWorksForYouGrid_viewerRefetch")
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

export const newWorksForYouGridQuery = graphql`
  query NewWorksForYouGridQuery($version: String, $maxWorksPerArtist: Int) {
    viewer @principalField {
      ...NewWorksForYouGrid_viewer
        @arguments(version: $version, maxWorksPerArtist: $maxWorksPerArtist)
    }
  }
`

export const NewWorksForYouGridQR: React.FC<NewWorksForYouScreenProps> = withSuspense(
  ({ version, maxWorksPerArtist }) => {
    const data = useLazyLoadQuery<NewWorksForYouGridQuery>(newWorksForYouGridQuery, {
      version,
      maxWorksPerArtist,
    })

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.viewer) {
      return <Text>Something went wrong.</Text>
    }

    return <NewWorksForYouGrid viewer={data.viewer} />
  },
  () => <NewWorksForYouPlaceholder defaultViewOption="grid" />
)
