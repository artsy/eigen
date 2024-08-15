import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SpacingUnit } from "@artsy/palette-mobile"
import { ArtworkRecommendationsRail_me$key } from "__generated__/ArtworkRecommendationsRail_me.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { useItemsImpressionsTracking } from "app/Scenes/Home/Components/useImpressionsTracking"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
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
  const AREnablePartnerOfferSignals = useFeatureFlag("AREnablePartnerOfferSignals")

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
          {...trackingProps}
          artworks={artworks}
          onPress={(artwork, position) => {
            if (!artwork.href) {
              return
            }

            const partnerOfferAvailable =
              AREnablePartnerOfferSignals && !!artwork.collectorSignals?.partnerOffer?.isAvailable

            trackEvent(
              tracks.tappedArtwork(
                artwork.slug,
                artwork.internalID,
                position,
                partnerOfferAvailable
              )
            )
            navigate(artwork.href)
          }}
          onMorePress={() => handleMorePress("viewAll")}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
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
  tappedArtwork: (slug: string, internalID: string, position: number, withPartnerOffer: boolean) =>
    HomeAnalytics.artworkThumbnailTapEvent(
      ContextModule.artworkRecommendationsRail,
      slug,
      internalID,
      position,
      "single",
      withPartnerOffer
    ),
}
