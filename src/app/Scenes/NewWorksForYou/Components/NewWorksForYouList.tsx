import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import { NewWorksForYouListQuery } from "__generated__/NewWorksForYouListQuery.graphql"
import { NewWorksForYouList_viewer$key } from "__generated__/NewWorksForYouList_viewer.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { NewWorksForYouHeaderComponent } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouHeader"
import {
  NewWorksForYouPlaceholder,
  NewWorksForYouScreenProps,
} from "app/Scenes/NewWorksForYou/NewWorksForYou"

import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import { Animated, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

type NewWorksForYouListProps = {
  viewer: NewWorksForYouList_viewer$key
}

export const NewWorksForYouList: React.FC<NewWorksForYouListProps> = ({ viewer }) => {
  const space = useSpace()

  const { data } = usePaginationFragment(newWorksForYouListFragment, viewer)

  const artworks = extractNodes(data.artworks)

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flex={1} pl={6} pr={4} pt={0.5} flexDirection="row">
        <Text variant="sm" numberOfLines={1} style={{ flexShrink: 1 }}>
          New Works For You
        </Text>
      </Flex>
    ),
  })
  return (
    <SafeAreaView edges={["top"]} style={{ height: Dimensions.get("screen").height }}>
      <AnimatedFlashlist
        estimatedItemSize={400}
        data={artworks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Flex px={2}>
            <NewWorksForYouHeaderComponent artworksCount={artworks.length} />
          </Flex>
        )}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ItemSeparatorComponent={() => <Flex mt={4} />}
        renderItem={({ item }) => {
          return (
            <ArtworkRailCard
              testID={`artwork-${item.slug}`}
              artwork={item}
              showPartnerName
              onPress={() => {
                // TODO: Add tracking if needed
                if (item.href) {
                  navigate(item.href)
                }
              }}
              showSaveIcon
              size="fullWidth"
              metaContainerStyles={{
                paddingHorizontal: space(2),
              }}
            />
          )
        }}
        {...scrollProps}
      />

      {headerElement}
    </SafeAreaView>
  )
}

const AnimatedFlashlist = Animated.createAnimatedComponent(FlashList) as unknown as typeof FlashList

const newWorksForYouListFragment = graphql`
  fragment NewWorksForYouList_viewer on Viewer
  @refetchable(queryName: "NewWorksForYouList_viewerRefetch")
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
      edges {
        node {
          id
          slug
          href
          ...ArtworkRailCard_artwork @arguments(width: 590)
        }
      }
    }
  }
`

export const newWorksForYouListQuery = graphql`
  query NewWorksForYouListQuery($version: String, $maxWorksPerArtist: Int) {
    viewer @principalField {
      ...NewWorksForYouList_viewer
        @arguments(version: $version, maxWorksPerArtist: $maxWorksPerArtist)
    }
  }
`

export const NewWorksForYouListQR: React.FC<NewWorksForYouScreenProps> = withSuspense(
  ({ version, maxWorksPerArtist }) => {
    const data = useLazyLoadQuery<NewWorksForYouListQuery>(newWorksForYouListQuery, {
      version,
      maxWorksPerArtist,
    })

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.viewer) {
      return <Text>Something went wrong.</Text>
    }

    return <NewWorksForYouList viewer={data.viewer} />
  },
  () => <NewWorksForYouPlaceholder defaultViewOption="list" />
)
