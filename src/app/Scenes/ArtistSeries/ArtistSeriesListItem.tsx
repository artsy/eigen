import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedArtistSeriesGroup,
} from "@artsy/cohesion"
import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import { ArtistSeriesConnectionEdge } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { RouterLink } from "app/system/navigation/RouterLink"
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
  const color = useColor()
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
    <RouterLink
      accessibilityLabel="Artist Series List Item"
      accessibilityRole="button"
      underlayColor={color("mono5")}
      // the negative margin here is for resetting padding of 20 that all the parent components of this instance
      // have and to avoid changing the component tree in multiple spots.
      style={{ marginHorizontal: -20 }}
      onPress={() => {
        trackArtworkClick()
      }}
      to={`/artist-series/${listItem?.node?.slug}`}
    >
      <Flex px={2} my={1} flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Flex flexDirection="row">
            <Flex height={70} width={70} borderRadius={2} overflow="hidden">
              <Image
                testID="list-item-image"
                src={listItem?.node?.image?.url ?? ""}
                height={70}
                width={70}
              />
            </Flex>
            <Flex ml={1} justifyContent="center">
              <Text variant="sm" testID="title">
                {listItem?.node?.title}
              </Text>
              {!!artworksCountMessage && (
                <Text variant="sm" color="mono60" testID="count">
                  {artworksCountMessage}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex alignSelf="center">
            <ChevronRightIcon />
          </Flex>
        </Flex>
      </Flex>
    </RouterLink>
  )
}
