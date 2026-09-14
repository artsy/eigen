import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { RouterLink } from "app/system/navigation/RouterLink"
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
  /**
   * Opens the stop's own details. Only reached by a stop with nowhere to navigate to — a
   * custom one the curator typed in, with no Artsy entity behind it.
   */
  onPress: (stop: ItineraryStop) => void
}

export const ItineraryStopRow: React.FC<Props> = ({ stop, number, onPress }) => {
  const card = stopCardFields(stop, stop.cardItem)
  // A custom stop's only link is wherever the curator found it, which leads out of Artsy, so
  // it opens its own details instead of navigating.
  const href = card.kind === "custom" ? undefined : card.href

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
      <Tap href={href} stop={stop} onPress={onPress}>
        {/*
          One child, not two: RouterLink renders palette's Touchable, which wraps multiple
          children in an unstyled Flex (Touchable.js:42) and leaves the row layout on the
          touchable itself, so the image and text had no width to share. No `flex` here
          either — the touchable is a column, so it would resolve against no height and
          flatten the row.
        */}
        <Flex testID="itinerary-stop-row-content" flexDirection="row" alignItems="center" gap={1}>
          <RNImage
            testID="itinerary-stop-image"
            src={stop.imageUrl}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />

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
      </Tap>

      {!!stop.saveTarget && (
        // The entity for this stop is resolved at screen level (ItineraryStopEntityResolvers),
        // one per saveable stop, each with its own Suspense and error boundary. This control is
        // just a reader of the reported result, so it needs neither here.
        <ItineraryStopSaveControl stopId={stop.id} stopTitle={stop.title} />
      )}
    </Flex>
  )
}

const ROW_STYLE = { flex: 1 } as const

/**
 * The tappable part of the row. A stop backed by an Artsy entity navigates straight to it;
 * one without goes nowhere, so it opens its own details instead.
 */
const Tap: React.FC<{
  href?: string
  stop: ItineraryStop
  onPress: (stop: ItineraryStop) => void
  children: React.ReactNode
}> = ({ href, stop, onPress, children }) => {
  if (href) {
    return (
      <RouterLink
        testID="itinerary-stop-row"
        accessibilityLabel={stop.title}
        to={href}
        disablePrefetch
        style={ROW_STYLE}
      >
        {children}
      </RouterLink>
    )
  }

  return (
    <TouchableOpacity
      testID="itinerary-stop-row"
      accessibilityRole="button"
      accessibilityLabel={stop.title}
      onPress={() => onPress(stop)}
      style={ROW_STYLE}
    >
      {children}
    </TouchableOpacity>
  )
}
