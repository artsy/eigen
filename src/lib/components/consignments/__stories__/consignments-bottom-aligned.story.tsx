import * as React from "react"
import { View } from "react-native"

import { storiesOf } from "@storybook/react-native"
import { camelCase } from "lodash"

import Search, { ArtistQueryData } from "../components/artist-search-results"


const query4Results: ArtistQueryData = {
  query: "bank",
  searching: false,
  results: [
    artistGen("Ada Van Hoorebeke"), artistGen("Kathleen Adair Brown"),
    artistGen("Linda Adair"), artistGen("Hector Adalid"),
  ],
}

export const allStates = [
  { "No query" : noQuery },
  { "Looking for new results" : queryNoResultsSearching },
  { "Found no results" : queryNoResults },
  { "Found one result" : query1Result },
  { "Found one result, and searching" : query1ResultSearching },
  { "Found two results" : query2Results },
  { "Found four results" : query4Results },
]

const stories = storiesOf("Consignments - Search")
allStates.forEach(element => {
  const name = Object.keys(element)[0]
  stories.add(name, () =>
  <View style={{flex: 1, backgroundColor: "black", padding: 20, marginTop: 60}}>
    <Search {...element[name]} />
  </View>,
  )
})
