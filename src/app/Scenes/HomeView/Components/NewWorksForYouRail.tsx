import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { NewWorksForYouRail_artworkConnection$key } from "__generated__/NewWorksForYouRail_artworkConnection.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
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
import { RailScrollProps } from "./types"

interface NewWorksForYouRailProps extends ArtworkActionTrackingProps {
  title: string
  artworkConnection: NewWorksForYouRail_artworkConnection$key
  isRailVisible: boolean
}

export const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = memo(
  ({ title, artworkConnection, isRailVisible, scrollRef, ...restProps }) => {
    const { trackEvent } = useTracking()
    const trackingProps = extractArtworkActionTrackingProps(restProps)

    const { artworksForUser } = useFragment(artworksFragment, artworkConnection)

    const railRef = useRef<View>(null)
    const listRef = useRef<FlatList<any>>(null)

    const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
      isInViewport: isRailVisible,
      contextModule: ContextModule.newWorksForYouRail,
    })

    useImperativeHandle(scrollRef, () => ({
      scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
    }))

    const artworks = extractNodes(artworksForUser)

    if (!artworks.length) {
      return null
    }

    const handleOnArtworkPress = (
      artwork: ArtworkRail_artworks$data[0] | ArtworkRail_artworks$data[0],
      position: number
    ) => {
      const collectorSignals = artwork.collectorSignals

      trackEvent(
        HomeAnalytics.artworkThumbnailTapEvent(
          ContextModule.newWorksForYouRail,
          artwork.slug,
          artwork.internalID,
          position,
          "single",
          collectorSignals
        )
      )
    }

    return (
      <Flex>
        <View ref={railRef}>
          <SectionTitle
            title={title}
            href="/new-for-you"
            onPress={() => {
              trackEvent(tracks.tappedHeader())
            }}
            px={2}
          />

          <ArtworkRail
            {...trackingProps}
            artworks={artworks}
            onPress={handleOnArtworkPress}
            showSaveIcon
            onMorePress={() => {
              trackEvent(tracks.tappedMoreCard())
              navigate("/new-for-you")
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
      </Flex>
    )
  }
)

const artworksFragment = graphql`
  fragment NewWorksForYouRail_artworkConnection on Viewer {
    artworksForUser(
      maxWorksPerArtist: 3
      includeBackfill: true
      first: 40
      version: $version
      excludeDislikedArtworks: true
    ) @connection(key: "NewWorksForYou_artworksForUser", filters: []) {
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
  tappedHeader: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.newWorksForYou,
    type: "header",
  }),
  tappedMoreCard: () => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.newWorksForYou,
    type: "viewAll",
  }),
}
