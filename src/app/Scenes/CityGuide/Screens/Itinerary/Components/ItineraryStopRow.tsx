import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Suspense } from "react"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { ErrorBoundary } from "react-error-boundary"
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 60
const BULLET_SIZE = 16

interface Props {
  stop: ItineraryStop
  /** Derived from the flattened stop index by the screen. Never stored on the stop. */
  number: number
}

export const ItineraryStopRow: React.FC<Props> = ({ stop, number }) => {
  return (
    <Flex flexDirection="row" alignItems="center" gap={1}>
      <Flex
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

      <RNImage
        src={stop.imageUrl}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />

      <Flex flex={1}>
        <Text variant="sm-display" numberOfLines={1} ellipsizeMode="tail">
          {stop.title}
        </Text>
        <Text variant="xs" color="mono60">
          {stop.displayTime}
        </Text>
        {!!stop.note && <Text variant="xs">{stop.note}</Text>}
      </Flex>

      {!!stop.saveTarget && (
        // Containment is mandatory, not decorative. The app's only ambient boundary is the
        // RetryErrorBoundary at Navigation/AuthenticatedRoutes/ScreenWrapper.tsx:51, which has
        // no Suspense — an uncontained suspending child blanks the whole screen into its retry
        // state. Both boundaries render null so one slow or 404 lookup costs one control.
        <ErrorBoundary fallbackRender={() => null}>
          <Suspense fallback={null}>
            <ItineraryStopSaveControl saveTarget={stop.saveTarget} stopTitle={stop.title} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Flex>
  )
}
