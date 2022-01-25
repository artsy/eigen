import { ArtworkTileRail_artworksConnection } from "__generated__/ArtworkTileRail_artworksConnection.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import { Spacer } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkTileRailCard } from "./ArtworkTileRailCard"

type ArtworkTileRailContainerProps = {
  artworksConnection: ArtworkTileRail_artworksConnection
  onTilePress?: (slug: string, id: string) => void
} & (
  | {
      contextModule?: undefined
      shouldTrack: false
    }
  | {
      contextModule: Schema.ContextModules
      shouldTrack?: boolean
    }
)

export const ArtworkTileRailContainer: React.FC<ArtworkTileRailContainerProps> = ({
  artworksConnection,
  contextModule,
  onTilePress,
  shouldTrack = true,
}) => {
  const artworks = extractNodes(artworksConnection)
  const tracking = useTracking()

  return (
    <View>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2} />}
        ListFooterComponent={() => <Spacer mr={2} />}
        ItemSeparatorComponent={() => <Spacer width={15} />}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={5}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkTileRailCard
            onPress={() => {
              if (shouldTrack) {
                tracking.trackEvent(
                  tappedArtworkGroupThumbnail(contextModule!, item.internalID, item.slug)
                )
              }
              {
                !!onTilePress ? onTilePress(item.slug, item.internalID) : navigate(item.href!)
              }
            }}
            imageURL={item.image?.imageURL}
            artistNames={item.artistNames}
            saleMessage={item.saleMessage}
            useSquareAspectRatio
            imageSize="small"
          />
        )}
        keyExtractor={(item, index) => String(item.image?.imageURL || index)}
      />
    </View>
  )
}

export const tappedArtworkGroupThumbnail = (
  contextModule: Schema.ContextModules,
  internalID: string,
  slug: string
) => {
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
    fragment ArtworkTileRail_artworksConnection on ArtworkConnectionInterface {
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
