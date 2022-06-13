import { Flex } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { ArtworkModuleRail_rail$data } from "__generated__/ArtworkModuleRail_rail.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { compact } from "lodash"
import { FlatList, View } from "react-native"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
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
  mb?: number
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

  return artworks.length ? (
    <Flex ref={railRef} mb={mb}>
      <Flex pl="2" pr="2">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          onPress={
            viewAllUrl
              ? () => {
                  const tapEvent = HomeAnalytics.artworkHeaderTapEvent(rail.key)
                  if (tapEvent) {
                    tracking.trackEvent(tapEvent)
                  }
                  navigate(viewAllUrl)
                }
              : undefined
          }
        />
      </Flex>
      <SmallArtworkRail
        listRef={listRef}
        artworks={artworks}
        onPress={(artwork, position) => {
          if (contextModule) {
            tracking.trackEvent(
              HomeAnalytics.artworkThumbnailTapEvent(
                contextModule,
                artwork.slug,
                position,
                "single"
              )
            )
          }

          navigate(artwork.href!)
        }}
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
        ...SmallArtworkRail_artworks
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
