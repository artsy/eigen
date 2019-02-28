import React, { Component } from "react"
import { MapRenderer } from "./MapRenderer"
import { Coordinates } from "./types"

interface Props {
  coordinates?: Coordinates
}

export class MapContainer extends Component<Props> {
  watchId: any

  // componentDidMount() {
  //   this.watchId = navigator.geolocation.watchPosition(
  //     position => {
  //       this.setState({
  //         coordinates: {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         },
  //       })
  //     },
  //     error => this.setState({ error: error.message }),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   )
  // }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId)
  }

  render() {
    const { coordinates } = this.props
    if (!coordinates) {
      // TODO: what even goes here?
      return null
    }

    return <MapRenderer coords={coordinates} />
  }
}
