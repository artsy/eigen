import * as Analytics from "@artsy/cohesion"
import { Box, color, Flex, Sans, Spacer } from "@artsy/palette"
import { SmallTileRail_artworks } from "__generated__/SmallTileRail_artworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import HomeAnalytics from "../homeAnalytics"

const SMALL_TILE_IMAGE_SIZE = 120

export const SmallTileRailContainer: React.FC<{
  artworks: SmallTileRail_artworks
  listRef: React.MutableRefObject<FlatList<any> | undefined>
  contextModule: Analytics.ContextModule | "untracked_rail"
}> = ({ artworks, listRef, contextModule }) => {
  const tracking = useTracking()
  return (
    <AboveTheFoldFlatList
      listRef={listRef}
      horizontal
      ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
      ListFooterComponent={() => <Spacer mr={2}></Spacer>}
      ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
      showsHorizontalScrollIndicator={false}
      data={artworks}
      initialNumToRender={4}
      windowSize={3}
      renderItem={({ item }) => (
        <ArtworkCard
          onPress={
            item.href
              ? () => {
                  tracking.trackEvent(HomeAnalytics.artworkThumbnailTapEvent(contextModule, item.slug, item.internalID))
                  SwitchBoard.presentNavigationViewController(listRef.current!, item.href)
                }
              : undefined
          }
        >
          >
          <Flex>
            <OpaqueImageView
              imageURL={(item.image?.imageURL ?? "").replace(":version", "square")}
              width={SMALL_TILE_IMAGE_SIZE}
              height={SMALL_TILE_IMAGE_SIZE}
              style={{ borderRadius: 2, overflow: "hidden" }}
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
      )}
      keyExtractor={(item, index) => String(item.image?.imageURL || index)}
    />
  )
}

const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

export const SmallTileRail = createFragmentContainer(SmallTileRailContainer, {
  artworks: graphql`
    fragment SmallTileRail_artworks on Artwork @relay(plural: true) {
      href
      saleMessage
      artistNames
      slug
      internalID
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
      partner {
        name
      }
      image {
        imageURL
      }
    }
  `,
})
