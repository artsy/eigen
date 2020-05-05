import { Box, color, Flex, Sans, Spacer, Theme } from "@artsy/palette"
import React, { useImperativeHandle, useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { FlatList, View } from "react-native"

import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RailScrollProps } from "./types"

const RAIL_HEIGHT = 100
const SMALL_TILE_IMAGE_SIZE = 120

function getViewAllUrl(rail: ArtworkRail_rail) {
  const context = rail.context
  const key = rail.key

  switch (key) {
    case "followed_artists":
      return "/works-for-you"
    case "followed_artist":
    case "related_artists":
      // @ts-ignore STRICTNESS_MIGRATION
      return context.artist.href
    case "saved_works":
      return "/favorites"
    case "genes":
    case "current_fairs":
    case "live_auctions":
      return context?.href
  }
}

// @ts-ignore STRICTNESS_MIGRATION
type ArtworkItem = ArtworkRail_rail["results"][0]

/*
Your active bids
New works for you
Recently viewed
Recently saved
*/
const smallTileKeys: Array<string | null> = ["active_bids", "followed_artists", "recently_viewed_works", "saved_works"]

const ArtworkRail: React.FC<{ rail: ArtworkRail_rail } & RailScrollProps> = ({ rail, scrollRef }) => {
  const railRef = useRef()
  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
  }))

  const viewAllUrl = getViewAllUrl(rail)
  const useSmallTile = smallTileKeys.includes(rail.key)

  const context = rail.context
  let subtitle: React.ReactChild | undefined
  const basedOnName = context?.basedOn?.name
  if (context?.__typename === "HomePageRelatedArtistArtworkModule" && Boolean(basedOnName)) {
    subtitle = `Based on ${basedOnName}`
  } else if (rail.key === "recommended_works") {
    subtitle = `Based on your activity on Artsy`
  }
  return (
    <Theme>
      <View
        // @ts-ignore STRICTNESS_MIGRATION
        ref={railRef}
      >
        <Flex pl="2" pr="2">
          <SectionTitle
            // @ts-ignore STRICTNESS_MIGRATION
            title={rail.title}
            subtitle={subtitle}
            // @ts-ignore STRICTNESS_MIGRATION
            onPress={viewAllUrl && (() => SwitchBoard.presentNavigationViewController(railRef.current, viewAllUrl))}
          />
        </Flex>
        <AboveTheFoldFlatList<ArtworkItem>
          listRef={listRef}
          horizontal
          // style={{ height: useSmallTile ? SMALL_TILE_IMAGE_SIZE : RAIL_HEIGHT }}
          ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
          ListFooterComponent={() => <Spacer mr={2}></Spacer>}
          ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={rail.results}
          initialNumToRender={4}
          windowSize={3}
          renderItem={({ item }) => {
            if (useSmallTile) {
              return (
                // @ts-ignore STRICTNESS_MIGRATION
                <ArtworkCard onPress={() => SwitchBoard.presentNavigationViewController(railRef.current, item.href)}>
                  <Flex>
                    <OpaqueImageView
                      imageURL={item.image?.imageURL.replace(":version", "square")}
                      width={SMALL_TILE_IMAGE_SIZE}
                      height={SMALL_TILE_IMAGE_SIZE}
                    />
                    <Box mt={1} width={SMALL_TILE_IMAGE_SIZE}>
                      <Sans size="3t" weight="medium" numberOfLines={1}>
                        {item.artistNames}
                      </Sans>
                      <Sans size="3t" color="black60" numberOfLines={1}>
                        {saleMessageOrBidInfo(item)}
                      </Sans>
                    </Box>
                  </Flex>
                </ArtworkCard>
              )
            } else {
              return (
                // @ts-ignore STRICTNESS_MIGRATION
                <ArtworkCard onPress={() => SwitchBoard.presentNavigationViewController(railRef.current, item.href)}>
                  <OpaqueImageView
                    imageURL={item.image?.imageURL.replace(":version", "square")}
                    width={RAIL_HEIGHT}
                    height={RAIL_HEIGHT}
                  />
                </ArtworkCard>
              )
            }
          }}
          keyExtractor={(item, index) => String(item.image?.imageURL || index)}
        />
      </View>
    </Theme>
  )
}

const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })`
  border-radius: 2px;
  overflow: hidden;
`

export const ArtworkRailFragmentContainer = createFragmentContainer(ArtworkRail, {
  rail: graphql`
    fragment ArtworkRail_rail on HomePageArtworkModule {
      title
      key
      results {
        href
        saleMessage
        artistNames
        sale {
          isAuction
          isClosed
          displayTimelyAt
        }
        saleArtwork {
          currentBid {
            display
          }
        }
        image {
          imageURL
        }
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
