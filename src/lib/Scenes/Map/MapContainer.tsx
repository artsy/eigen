import React, { Component } from "react"
import { MapRenderer } from "./MapRenderer"
import { Coordinates } from "./types"

interface Props {
  coordinates?: Coordinates
  hideMapButtons: boolean
}

export class MapContainer extends Component<Props> {
  watchId: any

  render() {
    const { coordinates, hideMapButtons } = this.props
    if (!coordinates) {
      // TODO: what even goes here?
      return null
    }

    return <MapRenderer coords={coordinates} hideMapButtons={hideMapButtons} />
  }
}
