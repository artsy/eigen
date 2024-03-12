import { Flex } from "@artsy/palette-mobile"
import { ArtworkModuleRail_rail$data } from "__generated__/ArtworkModuleRail_rail.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import { compact } from "lodash"
import React, { memo, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

export function getViewAllUrl(rail: ArtworkModuleRail_rail$data) {
  const context = rail.context
  const key = rail.key

  switch (key) {
    case "followed_artists":
      return "/works-for-you"
    case "followed_artist":
    case "related_artists":
      return context?.artist?.href
    case "recently_viewed_works":
      return "/recently-viewed"
    case "followed_galleries":
      return "/new-works-from-galleries-you-follow"
    case "saved_works":
      return "/favorites"
    case "genes":
    case "current_fairs":
    case "live_auctions":
      return context?.href
    case "similar_to_recently_viewed":
      return "/similar-to-recently-viewed"
  }
}

interface ArtworkModuleRailProps extends ArtworkActionTrackingProps {
  title: string
  rail: ArtworkModuleRail_rail$data
}

const ArtworkModuleRail: React.FC<ArtworkModuleRailProps & RailScrollProps> = ({
  title,
  rail,
  scrollRef,
  ...otherProps
}) => {
  const tracking = useTracking()
  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const viewAllUrl = getViewAllUrl(rail)

  const contextModule = HomeAnalytics.artworkRailContextModule(rail.key ?? "")

  const context = rail.context
  let subtitle: string | undefined
  const basedOnName = context?.basedOn?.name
  if (context?.__typename === "HomePageRelatedArtistArtworkModule" && Boolean(basedOnName)) {
    subtitle = `Based on ${basedOnName}`
  } else if (rail.key === "recommended_works") {
    subtitle = `Based on your activity on Artsy`
  }

  // This is to satisfy the TypeScript compiler based on Metaphysics types.
  const artworks = compact(rail.results ?? [])

  const showRail = artworks.length

  const trackingProps = extractArtworkActionTrackingProps(otherProps)

  if (!showRail) {
    return null
  }

  const handleTitlePress = viewAllUrl
    ? () => {
        const tapEvent = HomeAnalytics.artworkHeaderTapEvent(rail.key ?? "")
        if (tapEvent) {
          tracking.trackEvent(tapEvent)
        }
        navigate(viewAllUrl)
      }
    : undefined

  const handlePressMore = viewAllUrl
    ? () => {
        const tapEvent = HomeAnalytics.artworkShowMoreCardTapEvent(rail.key ?? "")
        if (tapEvent) {
          tracking.trackEvent(tapEvent)
        }
        navigate(viewAllUrl)
      }
    : undefined

  if (artworks.length === 0) {
    return null
  }

  return (
    <Flex ref={railRef}>
      <Flex pl={2} pr={2}>
        <SectionTitle title={title} subtitle={subtitle} onPress={handleTitlePress} />
      </Flex>
      <LargeArtworkRail
        {...trackingProps}
        listRef={listRef}
        artworks={artworks}
        onPress={(artwork, position) => {
          if (!artwork.href) {
            return
          }

          if (contextModule) {
            tracking.trackEvent(
              HomeAnalytics.artworkThumbnailTapEvent(
                contextModule,
                artwork.slug,
                artwork.internalID,
                position,
                "single"
              )
            )
          }

          navigate(artwork.href)
        }}
        onMorePress={handlePressMore}
      />
    </Flex>
  )
}

export const ArtworkModuleRailFragmentContainer = memo(
  createFragmentContainer(ArtworkModuleRail, {
    rail: graphql`
      fragment ArtworkModuleRail_rail on HomePageArtworkModule {
        title
        key
        results {
          slug
          ...LargeArtworkRail_artworks
        }
        context {
          ... on HomePageRelatedArtistArtworkModule {
            __typename
            artist {
              slug
              internalID
              href
            }
            basedOn {
              name
            }
          }
          ... on HomePageFollowedArtistArtworkModule {
            artist {
              href
            }
          }
          ... on Fair {
            href
          }
          ... on Gene {
            href
          }
          ... on Sale {
            href
          }
        }
      }
    `,
  })
)
