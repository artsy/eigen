import { ActionType, ContextModule, OwnerType, ScreenOwnerType, TappedArtistSeriesGroup } from "@artsy/cohesion"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ArtistSeriesConnectionEdge } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ArrowRightIcon, Flex, Sans } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"

interface ArtistSeriesListItemProps {
  listItem: ArtistSeriesConnectionEdge
  contextModule?: ContextModule
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  curationBoost?: boolean
  horizontalSlidePosition: number
}

export const ArtistSeriesListItem: React.FC<ArtistSeriesListItemProps> = ({
  contextModule,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  horizontalSlidePosition,
  listItem,
}) => {
  const { trackEvent } = useTracking()

  const artworksCountMessage = listItem?.node?.artworksCountMessage
  const destinationScreenOwnerId = listItem?.node?.internalID
  const destinationScreenOwnerSlug = listItem?.node?.slug
  const curationBoost = listItem?.node?.featured

  const trackArtworkClick = () => {
    const properties: TappedArtistSeriesGroup = {
      action: ActionType.tappedArtistSeriesGroup,
      context_module: contextModule || ContextModule.moreSeriesByThisArtist,
      context_screen_owner_type: contextScreenOwnerType,
      context_screen_owner_id: contextScreenOwnerId,
      context_screen_owner_slug: contextScreenOwnerSlug,
      destination_screen_owner_type: OwnerType.artistSeries,
      destination_screen_owner_id: destinationScreenOwnerId,
      destination_screen_owner_slug: destinationScreenOwnerSlug,
      horizontal_slide_position: horizontalSlidePosition,
      curation_boost: curationBoost,
      type: "thumbnail",
    }

    trackEvent(properties)
  }

  return (
    <TouchableOpacity
      onPress={() => {
        trackArtworkClick()
        navigate(`/artist-series/${listItem?.node?.slug}`)
      }}
    >
      <Flex flexDirection="row" mb="1" justifyContent="space-between">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Flex flexDirection="row">
            <OpaqueImageView
              imageURL={listItem?.node?.image?.url ?? ""}
              height={70}
              width={70}
              style={{ borderRadius: 2, overflow: "hidden" }}
            />
            <Flex ml="1" justifyContent="center">
              <Sans size="3t" data-test-id="title">
                {listItem?.node?.title}
              </Sans>
              {!!artworksCountMessage && (
                <Sans size="3" color="black60" data-test-id="count">
                  {artworksCountMessage}
                </Sans>
              )}
            </Flex>
          </Flex>
          <Flex alignSelf="center">
            <ArrowRightIcon />
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}
