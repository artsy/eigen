import React, { Component } from "react"
import { View } from "react-native"
import { MapRenderer } from "./MapRenderer"

interface Props {
  citySlug?: string
  hideMapButtons: boolean
}

export class MapContainer extends Component<Props> {
  render() {
    // TODO: If there is no city, we should show something else instead.
    const { citySlug, hideMapButtons } = this.props
    return citySlug ? <MapRenderer citySlug={citySlug} hideMapButtons={hideMapButtons} /> : <View />
  }
}
