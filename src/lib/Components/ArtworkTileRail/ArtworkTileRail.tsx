import { Spacer } from "@artsy/palette"
import { ArtworkTileRail_artworksConnection } from "__generated__/ArtworkTileRail_artworksConnection.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkTileRailCard } from "./ArtworkTileRailCard"

export const ArtworkTileRailContainer: React.FC<{
  artworksConnection: ArtworkTileRail_artworksConnection
  contextModule: Schema.ContextModules
  extra?: { route: (slug: string) => string }
}> = ({ artworksConnection, contextModule, extra }) => {
  const artworks = extractNodes(artworksConnection)
  const tracking = useTracking()
  const navRef = useRef<any>()

  return (
    <View ref={navRef}>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
        ListFooterComponent={() => <Spacer mr={2}></Spacer>}
        ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={5}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkTileRailCard
            onPress={() => {
              tracking.trackEvent(tappedArtworkGroupThumbnail(contextModule, item.internalID, item.slug))
              {
                !!extra?.route
                  ? SwitchBoard.presentNavigationViewController(navRef.current!, extra.route(item.slug))
                  : SwitchBoard.presentNavigationViewController(navRef.current!, item.href!)
              }
            }}
            imageURL={item.image?.imageURL}
            artistNames={item.artistNames}
            saleMessage={item.saleMessage}
          />
        )}
        keyExtractor={(item, index) => String(item.image?.imageURL || index)}
      />
    </View>
  )
}

export const tappedArtworkGroupThumbnail = (contextModule: Schema.ContextModules, internalID: string, slug: string) => {
  return {
    action_name: Schema.ActionNames.TappedArtworkGroup,
    action_type: Schema.ActionTypes.Tap,
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
