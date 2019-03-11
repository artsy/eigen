import { storiesOf } from "@storybook/react-native"
import React from "react"
import { MapRenderer } from ".."
import cities from "../../../../../data/cityDataSortedByDisplayPreference.json"

const stories = storiesOf("Map/Relay")

cities.forEach(city => {
  stories.add(city.name, () => <MapRenderer citySlug={city.slug} hideMapButtons />)
})
