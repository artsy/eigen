import { Box, color, Flex, Sans, Spacer } from "@artsy/palette"
import { ArtworkTileRail_artworksConnection } from "__generated__/ArtworkTileRail_artworksConnection.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import OpaqueImageView from "./OpaqueImageView/OpaqueImageView"

const SMALL_TILE_IMAGE_SIZE = 120

export const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

export const ArtworkTileRailContainer: React.FC<{
  artworksConnection: ArtworkTileRail_artworksConnection
  contextModule: Schema.ContextModules
}> = ({ artworksConnection, contextModule }) => {
  const artworks = artworksConnection.edges
  const tracking = useTracking()
  const navRef = useRef<any>()

  return (
    <View ref={navRef}>
      <FlatList
        horizontal
        style={{ borderRadius: 2, overflow: "hidden" }}
        ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={5}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkCard
            onPress={() => {
              tracking.trackEvent(tappedArtworkGroupThumbnail(contextModule, item!.node!.internalID, item!.node!.slug))
              SwitchBoard.presentNavigationViewController(navRef.current!, item?.node?.href! /* STRICTNESS_MIGRATION */)
            }}
          >
            <Flex>
              <OpaqueImageView
                imageURL={(item?.node?.image?.imageURL ?? "").replace(":version", "square")}
                width={SMALL_TILE_IMAGE_SIZE}
                height={SMALL_TILE_IMAGE_SIZE}
              />
              <Box mt={1} width={SMALL_TILE_IMAGE_SIZE}>
                <Sans size="3t" weight="medium" numberOfLines={1}>
                  {item?.node?.artistNames}
                </Sans>
                <Sans size="3t" color="black60" numberOfLines={1}>
                  {item?.node?.saleMessage}
                </Sans>
              </Box>
            </Flex>
          </ArtworkCard>
        )}
        keyExtractor={(item, index) => String(item?.node?.image?.imageURL || index)}
      />
    </View>
  )
}

export const tappedArtworkGroupThumbnail = (contextModule: Schema.ContextModules, internalID: string, slug: string) => {
  return {
    action_name: Schema.ActionNames.TappedArtworkGroup,
    context_module: contextModule,
    destination_screen: Schema.PageNames.ArtworkPage,
    destination_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
    destination_screen_owner_id: internalID,
    destination_screen_owner_slug: slug,
    type: "thumbnail",
  }
}

export const ArtworkTileRail = createFragmentContainer(ArtworkTileRailContainer, {
  artworksConnection: graphql`
    fragment ArtworkTileRail_artworksConnection on ArtworkConnection {
      edges {
        node {
          slug
          internalID
          href
          artistNames
          image {
            imageURL
          }
          saleMessage
        }
      }
    }
  `,
})
