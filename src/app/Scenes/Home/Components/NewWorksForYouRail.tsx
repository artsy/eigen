import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SpacingUnit } from "@artsy/palette-mobile"
import { NewWorksForYouRail_artworkConnection$key } from "__generated__/NewWorksForYouRail_artworkConnection.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { useFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface NewWorksForYouRailProps {
  title: string
  artworkConnection: NewWorksForYouRail_artworkConnection$key
  mb?: SpacingUnit
}

export const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = ({
  title,
  artworkConnection,
  scrollRef,
  mb,
}) => {
  const { trackEvent } = useTracking()
  const enableSaveIcon = useFeatureFlag("AREnableLargeArtworkRailSaveIcon")

  const { artworksForUser } = useFragment(artworksFragment, artworkConnection)

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

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
    navigate(artwork.href!)
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader())
              navigate(`/new-for-you`)
            }}
          />
        </Flex>
        <LargeArtworkRail
          artworks={artworks}
          onPress={handleOnArtworkPress}
          showSaveIcon={enableSaveIcon}
          trackingContextScreenOwnerType={Schema.OwnerEntityTypes.Home}
        />
      </View>
    </Flex>
  )
}

const artworksFragment = graphql`
  fragment NewWorksForYouRail_artworkConnection on Viewer {
    artworksForUser(
      maxWorksPerArtist: 3
      includeBackfill: true
      first: 40
      version: $worksForYouRecommendationsModelVariant
    ) {
      edges {
        node {
          title
          internalID
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
}
