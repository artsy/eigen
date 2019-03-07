import React, { Component } from "react"
import { View } from "react-native"
import { MapRenderer } from "./MapRenderer"

interface Props {
  citySlug?: string
  initialCoordinates?: { lat: number; lng: number }
  hideMapButtons: boolean
}

/// This container is pretty simple, but it helps to have a simple component for the root of our ARMapContainerViewController.
export class MapContainer extends Component<Props> {
  render() {
    const { citySlug, hideMapButtons, initialCoordinates } = this.props
    return citySlug ? (
      <MapRenderer citySlug={citySlug} hideMapButtons={hideMapButtons} initialCoordinates={initialCoordinates} />
    ) : (
      <View />
    )
  }
}
