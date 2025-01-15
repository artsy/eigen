import { ActionType, ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { RecommendedAuctionLotsRail_artworkConnection$key } from "__generated__/RecommendedAuctionLotsRail_artworkConnection.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import React, { memo, useRef } from "react"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface RecommendedAuctionLotsRailProps extends ArtworkActionTrackingProps {
  title: string
  artworkConnection: RecommendedAuctionLotsRail_artworkConnection$key | null | undefined
}

export const RecommendedAuctionLotsRail: React.FC<RecommendedAuctionLotsRailProps> = memo(
  ({ title, artworkConnection, contextScreenOwnerType, ...restProps }) => {
    const { trackEvent } = useTracking()

    const trackingProps = extractArtworkActionTrackingProps(restProps)

    const data = useFragment(artworksFragment, artworkConnection)

    const railRef = useRef<View>(null)

    const artworks = extractNodes(data?.artworksForUser)

    if (!artworks.length) {
      return null
    }

    const handleOnArtworkPress = (artwork: any, position: any) => {
      tracks.tappedArtwork(
        contextScreenOwnerType,
        ContextModule.lotsForYouRail,
        artwork.slug,
        artwork.internalID,
        position,
        "single"
      )
    }

    return (
      <View ref={railRef}>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader(contextScreenOwnerType))
              navigate("/auctions/lots-for-you-ending-soon")
            }}
          />
        </Flex>
        <ArtworkRail
          {...trackingProps}
          artworks={artworks}
          onPress={handleOnArtworkPress}
          showSaveIcon
          onMorePress={() => {
            trackEvent(tracks.tappedMoreCard(contextScreenOwnerType))
            navigate("/auctions/lots-for-you-ending-soon")
          }}
        />
      </View>
    )
  }
)

const artworksFragment = graphql`
  fragment RecommendedAuctionLotsRail_artworkConnection on Viewer {
    artworksForUser(includeBackfill: true, first: 10, onlyAtAuction: true) {
      edges {
        node {
          title
          internalID
          slug
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

const tracks = {
  tappedHeader: (contextScreenOwnerType: ScreenOwnerType | undefined) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.lotsForYouRail,
    context_screen_owner_type: contextScreenOwnerType,
    destination_screen_owner_type: OwnerType.lotsForYou,
    type: "header",
  }),

  tappedMoreCard: (contextScreenOwnerType: ScreenOwnerType | undefined) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.lotsForYouRail,
    context_screen_owner_type: contextScreenOwnerType,
    destination_screen_owner_type: OwnerType.lotsForYou,
    type: "viewAll",
  }),

  tappedArtwork: (
    contextScreenOwnerType: ScreenOwnerType | undefined,
    contextModule: ContextModule,
    slug: string,
    id: string,
    index?: number,
    moduleHeight?: "single" | "double"
  ) => ({
    contextScreenOwnerType: contextScreenOwnerType,
    destinationScreenOwnerType: OwnerType.artwork,
    destinationScreenOwnerSlug: slug,
    destinationScreenOwnerId: id,
    contextModule,
    horizontalSlidePosition: index,
    moduleHeight: moduleHeight ?? "double",
    type: "thumbnail",
  }),
}
