import { Flex, Text } from "@artsy/palette-mobile"
import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
import { StopCard } from "app/Scenes/CityGuide/Components/StopCard"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  itineraryStopCategory,
  itineraryStopCoordinates,
  itineraryStopImage,
  itineraryStopSaveTarget,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"

const BULLET_SIZE = 16

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
  const image = itineraryStopImage(stop)
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
    // `width="100%"`: without a definite width here, `StopCard`'s own `flex={1}` has nothing
    // to resolve against and collapses to its content's minimum size instead of filling the row.
    <Flex width="100%" flexDirection="row" alignItems="center" gap={1}>
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

      <StopCard
        card={card}
        image={image}
        href={href}
        accessibilityLabel={title}
        saveControl={
          // A custom stop has no entity to resolve, so its control renders straight away
          // rather than waiting on a lookup, and copies the stop's own fields.
          isCustom ? (
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
              // (ItineraryStopEntityResolvers), one per saveable stop, each with its own
              // Suspense and error boundary. This control is just a reader of the resolved result.
              <ItineraryStopSaveControl stopId={stop.internalID} stopTitle={title} />
            )
          )
        }
      />
    </Flex>
  )
}
