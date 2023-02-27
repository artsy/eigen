import { Flex, SpacingUnit } from "@artsy/palette-mobile"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { navigate } from "app/system/navigation/navigate"
import { compact } from "lodash"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkModuleRail_rail$data } from "__generated__/ArtworkModuleRail_rail.graphql"
import { RailScrollProps } from "./types"

export function getViewAllUrl(rail: ArtworkModuleRail_rail$data) {
  const context = rail.context
  const key = rail.key

  console.log({ key: rail.key })

  switch (key) {
    case "followed_artists":
      return "/works-for-you"
    case "followed_artist":
    case "related_artists":
      return context?.artist?.href
    case "recently_viewed_works":
      return "/recently-viewed"
    case "saved_works":
      return "/favorites"
    case "genes":
    case "current_fairs":
    case "live_auctions":
      return context?.href
  }
}

interface ArtworkModuleRailProps {
  title: string
  rail: ArtworkModuleRail_rail$data
  mb?: SpacingUnit
}

const ArtworkModuleRail: React.FC<ArtworkModuleRailProps & RailScrollProps> = ({
  title,
  rail,
  scrollRef,
  mb,
}) => {
  const tracking = useTracking()
  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const viewAllUrl = getViewAllUrl(rail)

  const contextModule = HomeAnalytics.artworkRailContextModule(rail.key)

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

  if (!showRail) {
    return null
  }

  const handleTitlePress = viewAllUrl
    ? () => {
        const tapEvent = HomeAnalytics.artworkHeaderTapEvent(rail.key)
        if (tapEvent) {
          tracking.trackEvent(tapEvent)
        }
        navigate(viewAllUrl)
      }
    : undefined

  const handlePressMore = viewAllUrl
    ? () => {
        const tapEvent = HomeAnalytics.artworkShowMoreCardTapEvent(rail.key)
        if (tapEvent) {
          tracking.trackEvent(tapEvent)
        }
        navigate(viewAllUrl)
      }
    : undefined

  return artworks.length ? (
    <Flex ref={railRef} mb={mb}>
      <Flex pl={2} pr={2}>
        <SectionTitle title={title} subtitle={subtitle} onPress={handleTitlePress} />
      </Flex>
      <LargeArtworkRail
        listRef={listRef}
        artworks={artworks}
        onPress={(artwork, position) => {
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

          navigate(artwork.href!)
        }}
        onMorePress={handlePressMore}
      />
    </Flex>
  ) : null
}

export const ArtworkModuleRailFragmentContainer = createFragmentContainer(ArtworkModuleRail, {
  rail: graphql`
    fragment ArtworkModuleRail_rail on HomePageArtworkModule {
      title
      key
      results {
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
