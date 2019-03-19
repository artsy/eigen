import React, { Component } from "react"
import { View } from "react-native"
import { MapRenderer } from "./MapRenderer"
import { SafeAreaInsets } from "./types"

interface Props {
  citySlug?: string
  initialCoordinates?: { lat: number; lng: number }
  hideMapButtons: boolean
  safeAreaInsets: SafeAreaInsets
  userLocationWithinCity: boolean
}

/// This container is pretty simple, but it helps to have a simple component for the root of our ARMapContainerViewController.
export class MapContainer extends Component<Props> {
  render() {
    const { citySlug, hideMapButtons, initialCoordinates, safeAreaInsets, userLocationWithinCity } = this.props
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
}
