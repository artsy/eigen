import React, { Component } from "react"
import { MapRenderer } from "./MapRenderer"
import { Coordinates } from "./types"

interface Props {
  coordinates: Coordinates
  hideMapButtons: boolean
}

// TODO: Do we even need this component any more?
export class MapContainer extends Component<Props> {
  render() {
    const { coordinates, hideMapButtons } = this.props
    return <MapRenderer coords={coordinates} hideMapButtons={hideMapButtons} />
  }
}
