import { storiesOf } from "@storybook/react-native"
import React from "react"
import { MapRenderer } from ".."
import { cityList } from "../../City/cities"

const stories = storiesOf("Map/Relay")

cityList.forEach(city => {
  stories.add(city.name, () => <MapRenderer citySlug={city.slug} hideMapButtons />)
})
