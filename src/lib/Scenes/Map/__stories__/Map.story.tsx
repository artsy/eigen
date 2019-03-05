import { storiesOf } from "@storybook/react-native"
import React from "react"
import { MapRenderer } from ".."

storiesOf("Map/Relay")
  .add("New York", () => <MapRenderer hideMapButtons coords={{ lat: 40.71, lng: -74.01 }} />)
  .add("Hong Kong", () => <MapRenderer hideMapButtons coords={{ lat: 22.4, lng: 114.11 }} />)
  .add("London", () => <MapRenderer hideMapButtons coords={{ lat: 51.51, lng: -0.13 }} />)
  .add("Los Angeles", () => <MapRenderer hideMapButtons coords={{ lat: 34.05, lng: -118.24 }} />)
  .add("Berlin", () => <MapRenderer hideMapButtons coords={{ lat: 52.52, lng: 13.4 }} />)
