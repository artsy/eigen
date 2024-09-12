import { ActionType, ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { RecommendedAuctionLotsRail_largeArtworkConnection$key } from "__generated__/RecommendedAuctionLotsRail_largeArtworkConnection.graphql"
import {
  RecommendedAuctionLotsRail_smallArtworkConnection$data,
  RecommendedAuctionLotsRail_smallArtworkConnection$key,
} from "__generated__/RecommendedAuctionLotsRail_smallArtworkConnection.graphql"
import { ArtworkRail2 } from "app/Components/ArtworkRail/ArtworkRail2"
import { SectionTitle } from "app/Components/SectionTitle"
import { RailScrollProps } from "app/Scenes/Home/Components/types"
import { useItemsImpressionsTracking } from "app/Scenes/Home/Components/useImpressionsTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import React, { memo, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface RecommendedAuctionLotsRailProps extends ArtworkActionTrackingProps {
  title: string
  artworkConnection:
    | RecommendedAuctionLotsRail_smallArtworkConnection$key
    | RecommendedAuctionLotsRail_largeArtworkConnection$key
    | null
    | undefined
  isRailVisible: boolean
  size: "small" | "large"
}

export const RecommendedAuctionLotsRail: React.FC<
  RecommendedAuctionLotsRailProps & RailScrollProps
> = memo(
  ({
    title,
    artworkConnection,
    isRailVisible,
    scrollRef,
    size,
    contextScreenOwnerType,
    ...restProps
  }) => {
    const { trackEvent } = useTracking()

    const trackingProps = extractArtworkActionTrackingProps(restProps)

    const { artworksForUser } = useFragment(
      size === "large" ? largeArtworksFragment : smallArtworksFragment,
      artworkConnection
    ) as RecommendedAuctionLotsRail_smallArtworkConnection$data

    const railRef = useRef<View>(null)
    const listRef = useRef<FlatList<any>>(null)

    const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
      isRailVisible,
      contextModule: ContextModule.lotsForYouRail,
    })

    useImperativeHandle(scrollRef, () => ({
      scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
    }))

    const artworks = extractNodes(artworksForUser)

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
      navigate(artwork.href)
    }

    const AuctionLotsRail = size == "large" ? ArtworkRail2 : ArtworkRail2

    return (
      <View ref={railRef}>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader(contextScreenOwnerType))
              navigate("/auctions/lots-for-you-ending-soon")
              console.log(contextScreenOwnerType)
            }}
          />
        </Flex>
        <AuctionLotsRail
          {...trackingProps}
          artworks={artworks as any}
          onPress={handleOnArtworkPress}
          showSaveIcon
          onMorePress={() => {
            trackEvent(tracks.tappedMoreCard(contextScreenOwnerType))
            navigate("/auctions/lots-for-you-ending-soon")
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>
    )
  }
)

const largeArtworksFragment = graphql`
  fragment RecommendedAuctionLotsRail_largeArtworkConnection on Viewer {
    artworksForUser(includeBackfill: true, first: 10, onlyAtAuction: true) {
      edges {
        node {
          title
          internalID
          slug
          ...ArtworkRail2_artworks
        }
      }
    }
  }
`

const smallArtworksFragment = graphql`
  fragment RecommendedAuctionLotsRail_smallArtworkConnection on Viewer {
    artworksForUser(includeBackfill: true, first: 10, onlyAtAuction: true) {
      edges {
        node {
          title
          internalID
          slug
          ...ArtworkRail2_artworks
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
