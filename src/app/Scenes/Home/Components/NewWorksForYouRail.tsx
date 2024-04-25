import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { NewWorksForYouRail_artworkConnection$key } from "__generated__/NewWorksForYouRail_artworkConnection.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { useItemsImpressionsTracking } from "app/Scenes/Home/Components/useImpressionsTracking"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
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
      isRailVisible,
      contextModule: ContextModule.newWorksForYouRail,
    })

    useImperativeHandle(scrollRef, () => ({
      scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
    }))

    const artworks = extractNodes(artworksForUser)

    if (!artworks.length) {
      return null
    }

    const handleOnArtworkPress = (artwork: any, position: any) => {
      trackEvent(
        HomeAnalytics.artworkThumbnailTapEvent(
          ContextModule.newWorksForYouRail,
          artwork.slug,
          artwork.internalID,
          position,
          "single"
        )
      )
      navigate(artwork.href)
    }

    return (
      <Flex>
        <View ref={railRef}>
          <Flex pl={2} pr={2}>
            <SectionTitle
              title={title}
              onPress={() => {
                trackEvent(tracks.tappedHeader())
                navigate("/new-for-you")
              }}
            />
          </Flex>
          <LargeArtworkRail
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
          ...LargeArtworkRail_artworks
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
