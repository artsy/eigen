import React, { Component } from "react"
import { View } from "react-native"
import { MapRenderer } from "./MapRenderer"
import { Coordinates } from "./types"

interface Props {
  coordinates?: Coordinates
  hideMapButtons: boolean
}

export class MapContainer extends Component<Props> {
  render() {
    const { coordinates, hideMapButtons } = this.props
    // TODO: If there are no coords, we should show something else instead.
    return coordinates ? <MapRenderer coords={coordinates} hideMapButtons={hideMapButtons} /> : <View />
  }
}
