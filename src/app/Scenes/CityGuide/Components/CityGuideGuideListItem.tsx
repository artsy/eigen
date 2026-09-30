import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Spacer, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useTracking } from "react-tracking"

const IMAGE_SIZE = 85
const FEATURED_HEIGHT = 198
const NO_ICON_SIZE = 24
const FEATURED_NO_ICON_SIZE = 40

export interface GuideRow {
  id: string
  /** What `Query.itinerary` is addressed by: a published guide's slug, else its id. */
  itineraryId: string
  internalID: string
  slug: string | null
  title: string
  subtitle: string
  authorName: string
  imageUrl: string
  /** Same image at a size that holds up across the full width of the featured item. */
  featuredImageUrl: string
  /** Set editorially in Gravity. The one guide that leads the section, opened up large. */
  featured: boolean
}

export const GuideListItem = ({ item, citySlug }: { item: GuideRow; citySlug: string }) => {
  const { trackEvent } = useTracking()

  return (
    // No `hasChildTouchable`: that mode makes RouterLink render nothing itself and clone
    // onPress onto its child (RouterLink.tsx:92-99). The child here is a styled View, which
    // ignores onPress, so the row would not be pressable at all. Without the prop,
    // RouterLink renders its own Touchable (RouterLink.tsx:103) and carries the testID.
    <RouterLink
      testID="event-guide-row"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
      onPress={() => trackEvent(tracks.tappedGuide(citySlug, item.internalID, item.slug))}
    >
      <Flex flexDirection="row" gap={1} alignItems="center">
        {item.imageUrl ? (
          <Image
            testID="event-guide-image"
            src={item.imageUrl}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            resizeMode="cover"
          />
        ) : (
          <Flex
            testID="event-guide-no-image"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            backgroundColor="mono10"
            alignItems="center"
            justifyContent="center"
          >
            <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
          </Flex>
        )}

        <Flex flex={1}>
          <Text variant="md" color="mono0">
            {item.title}
          </Text>
          {!!item.subtitle && (
            <Text variant="xs" color="mono10" numberOfLines={2}>
              {item.subtitle}
            </Text>
          )}
          {!!item.authorName && (
            <Text variant="xs" color="mono10">
              By {item.authorName}
            </Text>
          )}
        </Flex>
      </Flex>
    </RouterLink>
  )
}

/** The lead guide: the same row, opened up to a full-width image with its text underneath. */
export const FeaturedGuideItem = ({ item, citySlug }: { item: GuideRow; citySlug: string }) => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const imageWidth = screenWidth - 2 * space(2)
  const { trackEvent } = useTracking()

  return (
    <RouterLink
      testID="event-guide-featured"
      to={`/city-guide/${citySlug}/itinerary/${item.itineraryId}`}
      onPress={() => trackEvent(tracks.tappedGuide(citySlug, item.internalID, item.slug))}
    >
      {item.featuredImageUrl ? (
        <Image
          testID="event-guide-featured-image"
          src={item.featuredImageUrl}
          width={imageWidth}
          height={FEATURED_HEIGHT}
          resizeMode="cover"
        />
      ) : (
        <Flex
          testID="event-guide-featured-no-image"
          width={imageWidth}
          height={FEATURED_HEIGHT}
          backgroundColor="mono10"
          alignItems="center"
          justifyContent="center"
        >
          <NoArtIcon width={FEATURED_NO_ICON_SIZE} height={FEATURED_NO_ICON_SIZE} fill="mono60" />
        </Flex>
      )}

      <Spacer y={1} />

      <Text variant="md" color="mono0">
        {item.title}
      </Text>
      {!!item.subtitle && (
        <Text variant="xs" color="mono10">
          {item.subtitle}
        </Text>
      )}
      {!!item.authorName && (
        <Text variant="xs" color="mono10">
          By {item.authorName}
        </Text>
      )}
    </RouterLink>
  )
}

const tracks = {
  tappedGuide: (citySlug: string, guideId: string, slug: string | null) => ({
    action: ActionType.tappedExploreGroup,
    context_module: ContextModule.cityGuideCard,
    context_screen_owner_type: OwnerType.cityGuide,
    context_screen_owner_slug: citySlug,
    destination_screen_owner_type: OwnerType.cityGuideGuide,
    destination_screen_owner_id: guideId,
    ...(slug ? { destination_screen_owner_slug: slug } : {}),
  }),
}
