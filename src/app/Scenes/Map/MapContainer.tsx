import { View } from "react-native"
import { SafeAreaInsets, useScreenDimensions } from "shared/hooks"
import { MapRenderer } from "./MapRenderer"

interface Props {
  citySlug?: string
  initialCoordinates?: { lat: number; lng: number }
  hideMapButtons: boolean
  safeAreaInsets: SafeAreaInsets
  userLocationWithinCity: boolean
}

/// This container is pretty simple, but it helps to have a simple component for the root of our ARMapContainerViewController.
export function MapContainer(props: Props) {
  const { citySlug, hideMapButtons, initialCoordinates, userLocationWithinCity } = props
  const { safeAreaInsets } = useScreenDimensions()
  return citySlug ? (
    <MapRenderer
      citySlug={citySlug}
      hideMapButtons={hideMapButtons}
      initialCoordinates={initialCoordinates}
      safeAreaInsets={safeAreaInsets}
      userLocationWithinCity={userLocationWithinCity}
    />
  ) : (
    <View />
  )
}
