import { SafeAreaInsets, useScreenDimensions } from "app/utils/hooks"
import { View } from "react-native"
import { MapRenderer } from "./MapRenderer"

export type ShortCoordinates = { lat: number; lng: number }
interface Props {
  citySlug?: string
  initialCoordinates?: ShortCoordinates
  hideMapButtons: boolean
  safeAreaInsets: SafeAreaInsets
  userLocationWithinCity: boolean
}

/// This container is pretty simple, but it helps to have a simple component for the root of our ARMapContainerViewController.
export function MapContainer(props: Props) {
  const { citySlug, hideMapButtons, userLocationWithinCity } = props
  const { safeAreaInsets } = useScreenDimensions()
  return citySlug ? (
    <MapRenderer
      citySlug={citySlug}
      hideMapButtons={hideMapButtons}
      safeAreaInsets={safeAreaInsets}
      userLocationWithinCity={userLocationWithinCity}
    />
  ) : (
    <View />
  )
}
