import { Flex, Text } from "@artsy/palette-mobile"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Suspense } from "react"
// TODO: Replace with Image from @artsy/palette-mobile once we get the data from the API
import { ErrorBoundary } from "react-error-boundary"
import { Image as RNImage, TouchableOpacity } from "react-native"

const IMAGE_SIZE = 60
const BULLET_SIZE = 16

interface Props {
  stop: ItineraryStop
  /** Derived from the flattened stop index by the screen. Never stored on the stop. */
  number: number
  onPress: (stop: ItineraryStop) => void
}

export const ItineraryStopRow: React.FC<Props> = ({ stop, number, onPress }) => {
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
          {/* The note is the longer editorial line; it belongs in the preview sheet. */}
          {!!stop.address && (
            <Text variant="xs" color="mono60" numberOfLines={1} ellipsizeMode="tail">
              {stop.address}
            </Text>
          )}
        </Flex>
      </TouchableOpacity>

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
