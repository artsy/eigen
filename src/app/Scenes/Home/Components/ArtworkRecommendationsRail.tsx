import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SpacingUnit } from "@artsy/palette-mobile"
import { ArtworkRecommendationsRail_me$key } from "__generated__/ArtworkRecommendationsRail_me.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import { extractNodes } from "app/utils/extractNodes"
import React, { memo, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface ArtworkRecommendationsRailProps {
  title: string
  me: ArtworkRecommendationsRail_me$key
  mb?: SpacingUnit
}

export const ArtworkRecommendationsRail: React.FC<
  ArtworkRecommendationsRailProps & RailScrollProps
> = memo(({ title, me, scrollRef, mb }) => {
  const { trackEvent } = useTracking()

  const { artworkRecommendations } = useFragment(artworksFragment, me)

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const artworks = extractNodes(artworkRecommendations)

  const { navigateToPageableRoute } = useNavigateToPageableRoute({ items: artworks })

  if (!artworks.length) {
    return null
  }

  const handleMorePress = (type: string) => {
    trackEvent(tracks.tappedMore(type))
    navigate("/artwork-recommendations")
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl={2} pr={2}>
          <SectionTitle title={title} onPress={() => handleMorePress("header")} />
        </Flex>
        <LargeArtworkRail
          artworks={artworks}
          onPress={(artwork, position) => {
            trackEvent(tracks.tappedArtwork(artwork.slug, artwork.internalID, position))
            navigateToPageableRoute(artwork.href!)
          }}
          onMorePress={() => handleMorePress("viewAll")}
        />
      </View>
    </Flex>
  )
})

const artworksFragment = graphql`
  fragment ArtworkRecommendationsRail_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
    artworkRecommendations(first: $count, after: $cursor)
      @connection(key: "ArtworkRecommendationsRail_artworkRecommendations") {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        node {
          slug
          ...LargeArtworkRail_artworks
        }
      }
    }
  }
`

const tracks = {
  tappedMore: (type: string) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.artworkRecommendationsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.artworkRecommendations,
    type: type,
  }),
  tappedArtwork: (slug: string, internalID: string, position: number) =>
    HomeAnalytics.artworkThumbnailTapEvent(
      ContextModule.artworkRecommendationsRail,
      slug,
      internalID,
      position,
      "single"
    ),
}
