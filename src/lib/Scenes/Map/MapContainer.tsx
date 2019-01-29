import React, { Component } from "react"
import { MapRenderer } from "./MapRenderer"
import { Coordinates } from "./types"

interface State {
  coordinates: Coordinates
  error: any
}

export class MapContainer extends Component<null, State> {
  watchId: any
  state = {
    coordinates: null,
    error: null,
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId)
  }

  render() {
    const { coordinates } = this.state
    if (!coordinates) {
      // Show spinner
      return null
    }

    return <MapRenderer coords={coordinates} />
  }
}
