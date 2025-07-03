import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SpacingUnit } from "@artsy/palette-mobile"
import { ArtworkRecommendationsRail_me$key } from "__generated__/ArtworkRecommendationsRail_me.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { extractNodes } from "app/utils/extractNodes"
import { CollectorSignals } from "app/utils/getArtworkSignalTrackingFields"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import React, { memo, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface ArtworkRecommendationsRailProps extends ArtworkActionTrackingProps {
  isRailVisible: boolean
  mb?: SpacingUnit
  me: ArtworkRecommendationsRail_me$key
  title: string
}

export const ArtworkRecommendationsRail: React.FC<
  ArtworkRecommendationsRailProps & RailScrollProps
> = memo(({ isRailVisible, mb, me, scrollRef, title, ...otherProps }) => {
  const { trackEvent } = useTracking()
  const trackingProps = extractArtworkActionTrackingProps(otherProps)

  const { artworkRecommendations } = useFragment(artworksFragment, me)

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
    isRailVisible,
    contextModule: ContextModule.artworkRecommendationsRail,
  })

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const artworks = extractNodes(artworkRecommendations)

  if (!artworks.length) {
    return null
  }

  const handleMorePress = () => {
    trackEvent(tracks.tappedMore("viewAll"))
  }

  const handleHeaderPress = () => {
    trackEvent(tracks.tappedMore("header"))
  }

  const moreHref = "/artwork-recommendations"

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <SectionTitle href={moreHref} title={title} onPress={handleHeaderPress} mx={2} />

        <ArtworkRail
          {...trackingProps}
          artworks={artworks}
          onPress={(artwork, position) => {
            if (!artwork.href) {
              return
            }

            trackEvent(
              tracks.tappedArtwork(
                artwork.slug,
                artwork.internalID,
                position,
                artwork.collectorSignals
              )
            )
          }}
          onMorePress={handleMorePress}
          moreHref={moreHref}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          showSaveIcon
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
          ...ArtworkRail_artworks
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
  tappedArtwork: (
    slug: string,
    internalID: string,
    position: number,
    collectorSignals: CollectorSignals
  ) =>
    HomeAnalytics.artworkThumbnailTapEvent(
      ContextModule.artworkRecommendationsRail,
      slug,
      internalID,
      position,
      "single",
      collectorSignals
    ),
}
