import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, Text } from "@artsy/palette-mobile"
import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  itineraryStopCategory,
  itineraryStopCoordinates,
  itineraryStopImageUrl,
  itineraryStopSaveTarget,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { RouterLink } from "app/system/navigation/RouterLink"

/** The designs' card image: taller than square, at 60 × 70. */
const IMAGE_WIDTH = 60
const IMAGE_HEIGHT = 70
/** The dot between hours and admission. */
const DOT_SIZE = 4
const BULLET_SIZE = 16
const NO_ICON_SIZE = 24
const ROW_STYLE = { flex: 1 } as const

interface Props {
  stop: ItineraryStop
  /** Derived from the flattened stop index, never stored on the stop. Absent on your own
   *  itinerary, which is unordered and renders no bullet. */
  number?: number
  /** Where a custom stop's own screen lives, which needs the itinerary this stop belongs to. */
  citySlug: string
  itineraryId: string
  /** What a new itinerary gets called when a custom stop is copied onto one. */
  cityName: string
}

export const ItineraryStopRow: React.FC<Props> = ({
  stop,
  number,
  citySlug,
  itineraryId,
  cityName,
}) => {
  const title = itineraryStopTitle(stop)
  const imageUrl = itineraryStopImageUrl(stop)
  const saveTarget = itineraryStopSaveTarget(stop)
  const coordinates = itineraryStopCoordinates(stop)
  const card = stopCardFields(stop, stop.item)
  // Nothing resolved from Artsy: no entity to follow and no entity page to open.
  const isCustom = !stop.item && !saveTarget
  // A custom stop's only link is wherever the curator found it, which leads out of Artsy, so
  // it goes to its own screen instead.
  const href = isCustom
    ? `/city-guide/${citySlug}/itinerary/${itineraryId}/stop/${stop.internalID}`
    : card.href

  return (
    <Flex flexDirection="row" alignItems="center" gap={1}>
      {number !== undefined && (
        <Flex
          testID="itinerary-stop-number"
          width={BULLET_SIZE}
          height={BULLET_SIZE}
          borderRadius={BULLET_SIZE / 2}
          backgroundColor="mono100"
          alignItems="center"
          justifyContent="center"
        >
          <Text variant="xxs" color="mono0">
            {number}
          </Text>
        </Flex>
      )}

      {/*
        Only the image and text are tappable. The save control sits outside, so tapping it
        saves rather than navigating.
      */}
      <RouterLink
        testID="itinerary-stop-row"
        accessibilityLabel={title}
        to={href}
        disablePrefetch
        style={ROW_STYLE}
      >
        {/*
          One child, not two: RouterLink renders palette's Touchable, which wraps multiple
          children in an unstyled Flex (Touchable.js:42) and leaves the row layout on the
          touchable itself, so the image and text had no width to share. No `flex` here
          either — the touchable is a column, so it would resolve against no height and
          flatten the row.
        */}
        <Flex testID="itinerary-stop-row-content" flexDirection="row" alignItems="center" gap={1}>
          {imageUrl ? (
            <Image
              testID="itinerary-stop-image"
              src={imageUrl}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              resizeMode="cover"
            />
          ) : (
            <Flex
              testID="itinerary-stop-no-image"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              backgroundColor="mono10"
              alignItems="center"
              justifyContent="center"
            >
              <NoArtIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="mono60" />
            </Flex>
          )}

          {/*
            Three lines, per the designs: what it is, where it is, then hours and admission
            separated by a dot. Which of them are filled depends on what the stop resolved
            to — see `stopCardFields`. The note is the longer editorial line, not shown here.
          */}
          <Flex flex={1}>
            <Text variant="sm-display" numberOfLines={1} ellipsizeMode="tail">
              {card.title}
            </Text>

            {!!card.subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={1} ellipsizeMode="tail">
                {card.subtitle}
              </Text>
            )}

            {(!!card.hours || !!card.admission) && (
              <Flex flexDirection="row" alignItems="center" gap={0.5}>
                {!!card.hours && (
                  <Text variant="xs" color="mono60">
                    {card.hours}
                  </Text>
                )}

                {/* The designs separate the two with a 4pt dot, shown only when both are there. */}
                {!!card.hours && !!card.admission && (
                  <Flex
                    testID="itinerary-stop-meta-dot"
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    borderRadius={DOT_SIZE / 2}
                    backgroundColor="mono60"
                  />
                )}

                {!!card.admission && (
                  <Text variant="xs" color="mono60">
                    {card.admission}
                  </Text>
                )}
              </Flex>
            )}

            {/* The designs' fourth line, which grows the card to 90. Only a reception today. */}
            {!!card.reception && (
              <Text variant="xs" color="mono100">
                {card.reception}
              </Text>
            )}
          </Flex>
        </Flex>
      </RouterLink>

      {/*
        A custom stop has no entity to resolve, so its control renders straight away rather
        than waiting on a lookup, and copies the stop's own fields.
      */}
      {isCustom ? (
        <CustomStopSaveControl
          stop={{
            title,
            address: stop.address ?? undefined,
            note: stop.note ?? undefined,
            sourceURL: stop.sourceURL ?? undefined,
            category: itineraryStopCategory(stop.category),
            isFreeAdmission: stop.isFreeAdmission ?? undefined,
            latitude: coordinates?.lat,
            longitude: coordinates?.lng,
          }}
          citySlug={citySlug}
          cityName={cityName}
        />
      ) : (
        !!saveTarget && (
          // The entity for this stop is resolved at screen level
          // (ItineraryStopEntityResolvers), one per saveable stop, each with its own Suspense
          // and error boundary. This control is just a reader of the reported result.
          <ItineraryStopSaveControl stopId={stop.internalID} stopTitle={title} />
        )
      )}
    </Flex>
  )
}
