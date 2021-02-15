import { Box, Flex, Theme } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { compact } from "lodash"
import { FlatList, View } from "react-native"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
import { SmallTileRailContainer } from "./SmallTileRail"
import { RailScrollProps } from "./types"

function getViewAllUrl(rail: ArtworkRail_rail) {
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

/*
Your Active Bids
New Works For You
Recently Viewed
Recently Saved
*/
const smallTileKeys: Array<string | null> = ["active_bids", "followed_artists", "recently_viewed_works", "saved_works"]

const ArtworkRail: React.FC<{ rail: ArtworkRail_rail } & RailScrollProps> = ({ rail, scrollRef }) => {
  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const viewAllUrl = getViewAllUrl(rail)
  const useSmallTile = smallTileKeys.includes(rail.key)

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
  const tracking = useTracking()

  return artworks.length ? (
    <Theme>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle
            title={rail.title}
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
        {useSmallTile ? (
          <SmallTileRailContainer
            listRef={listRef}
            artworks={artworks}
            contextModule={HomeAnalytics.artworkRailContextModule(rail.key)}
          />
        ) : (
          <Box mx="2">
            <GenericGrid
              artworks={artworks}
              trackTap={(artworkSlug, index) => {
                const tapEvent = HomeAnalytics.artworkThumbnailTapEventFromKey(rail.key, artworkSlug, index)
                if (tapEvent) {
                  tracking.trackEvent(tapEvent)
                }
              }}
            />
          </Box>
        )}
      </View>
    </Theme>
  ) : null
}

export const ArtworkRailFragmentContainer = createFragmentContainer(ArtworkRail, {
  rail: graphql`
    fragment ArtworkRail_rail on HomePageArtworkModule {
      title
      key
      results {
        ...SmallTileRail_artworks
        ...GenericGrid_artworks
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
