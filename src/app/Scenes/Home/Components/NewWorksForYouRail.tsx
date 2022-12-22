import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NewWorksForYouRail_artworkConnection$key } from "__generated__/NewWorksForYouRail_artworkConnection.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { maybeReportExperimentVariant } from "app/utils/experiments/reporter"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { Flex } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"
import { RailScrollProps } from "./types"

interface NewWorksForYouRailProps {
  title: string
  artworkConnection: NewWorksForYouRail_artworkConnection$key
  mb?: number
}

export const NewWorksForYouRail: React.FC<NewWorksForYouRailProps & RailScrollProps> = ({
  title,
  artworkConnection,
  scrollRef,
  mb,
}) => {
  const { trackEvent } = useTracking()
  const enforceLargeRail = useFeatureFlag("AREnforceLargeNewWorksRail")
  const railVariant = useExperimentVariant("eigen-new-works-for-you-rail-size")
  const enableSaveIcon = useFeatureFlag("AREnableLargeArtworkRailSaveIcon")

  trackExperimentVariant(
    "eigen-new-works-for-you-rail-size",
    railVariant.enabled,
    railVariant.variant,
    railVariant.payload
  )

  const { artworksForUser, smallArtworksForUser } = useFragment(artworksFragment, artworkConnection)

  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const artworks = extractNodes(artworksForUser)
  const smallArtworks = extractNodes(smallArtworksForUser)

  if (!artworks.length) {
    return null
  }

  const handleOnArtworkPress = (artwork: any, position: any) => {
    trackEvent(
      HomeAnalytics.artworkThumbnailTapEvent(
        ContextModule.newWorksForYouRail,
        artwork.slug,
        position,
        "single"
      )
    )
    navigate(artwork.href!)
  }

  return (
    <Flex mb={mb}>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedHeader())
              navigate(`/new-for-you`)
            }}
          />
        </Flex>
        {railVariant.variant === "experiment" || enforceLargeRail ? (
          <LargeArtworkRail
            artworks={artworks}
            onPress={handleOnArtworkPress}
            showSaveIcon={enableSaveIcon}
            trackingContextScreenOwnerType={Schema.OwnerEntityTypes.Home}
          />
        ) : (
          <SmallArtworkRail
            artworks={smallArtworks}
            onPress={handleOnArtworkPress}
            trackingContextScreenOwnerType={Schema.OwnerEntityTypes.Home}
          />
        )}
      </View>
    </Flex>
  )
}

const artworksFragment = graphql`
  fragment NewWorksForYouRail_artworkConnection on Viewer {
    smallArtworksForUser: artworksForUser(maxWorksPerArtist: 3, includeBackfill: true, first: 40) {
      edges {
        node {
          title
          internalID
          ...SmallArtworkRail_artworks
        }
      }
    }
    artworksForUser(maxWorksPerArtist: 3, includeBackfill: true, first: 40) {
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

const trackExperimentVariant = (
  name: string,
  enabled: boolean,
  variant: string,
  payload?: string
) =>
  maybeReportExperimentVariant({
    name,
    enabled,
    variant,
    payload,
    context_module: ContextModule.newWorksForYouRail,
    context_screen_owner_type: OwnerType.home,
    context_screen: Schema.PageNames.Home,
  })
