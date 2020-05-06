import { Box, Flex, Theme } from "@artsy/palette"
import React, { useImperativeHandle, useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { FlatList, View } from "react-native"

import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { compact } from "lodash"
import { SmallTileRail } from "./SmallTileRail"
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
Your active bids
New works for you
Recently viewed
Recently saved
*/
const smallTileKeys: Array<string | null> = ["active_bids", "followed_artists", "recently_viewed_works", "saved_works"]

const ArtworkRail: React.FC<{ rail: ArtworkRail_rail } & RailScrollProps> = ({ rail, scrollRef }) => {
  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
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

  return artworks.length ? (
    <Theme>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle
            title={rail.title}
            subtitle={subtitle}
            onPress={
              viewAllUrl ? () => SwitchBoard.presentNavigationViewController(railRef.current!, viewAllUrl) : undefined
            }
          />
        </Flex>
        {useSmallTile ? (
          <SmallTileRail listRef={listRef} artworks={artworks} />
        ) : (
          <Box mx={2}>
            <GenericGrid artworks={artworks} />
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
