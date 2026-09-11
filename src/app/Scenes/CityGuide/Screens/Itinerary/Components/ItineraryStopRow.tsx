import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { Image as RNImage, TouchableOpacity } from "react-native"

/** The designs' card image: taller than square, at 60 × 70. */
const IMAGE_WIDTH = 60
const IMAGE_HEIGHT = 70
/** The dot between hours and admission. */
const DOT_SIZE = 4
const BULLET_SIZE = 16

interface Props {
  stop: ItineraryStop
  /** Derived from the flattened stop index by the screen. Never stored on the stop. */
  /**
   * Its position in the guide. Absent on your own itinerary, which is a single unordered
   * list, so no numbered bullet renders at all.
   */
  number?: number
  onPress: (stop: ItineraryStop) => void
}

export const ItineraryStopRow: React.FC<Props> = ({ stop, number, onPress }) => {
  const card = stopCardFields(stop, stop.cardItem)

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
        Only the image and text open the preview. The save control sits outside the
        touchable so tapping it saves rather than opening the sheet.
      */}
      <TouchableOpacity
        testID="itinerary-stop-row"
        accessibilityRole="button"
        accessibilityLabel={stop.title}
        onPress={() => onPress(stop)}
        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
      >
        <RNImage
          src={stop.imageUrl}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        {/*
          Three lines, per the designs: what it is, where it is, then hours and admission
          separated by a dot. Which of them are filled depends on what the stop resolved to —
          see `stopCardFields`. The note is the longer editorial line and belongs in the
          preview sheet, not here.
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
        </Flex>
      </TouchableOpacity>

      {!!stop.saveTarget && (
        // The entity for this stop is resolved at screen level (ItineraryStopEntityResolvers),
        // one per saveable stop, each with its own Suspense and error boundary. This control is
        // just a reader of the reported result, so it needs neither here.
        <ItineraryStopSaveControl stopId={stop.id} stopTitle={stop.title} />
      )}
    </Flex>
  )
}
