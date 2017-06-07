import * as React from "react"
import { View } from "react-native"

import { storiesOf } from "@storybook/react-native"
import { camelCase } from "lodash"

import Search, { ArtistQueryData } from "../components/artist-search-results"

const noQuery: ArtistQueryData = {
  query: null,
  searching: false,
  results: [],
}

const queryNoResults: ArtistQueryData = {
  query: "ba",
  searching: false,
  results: [],
}

const queryNoResultsSearching: ArtistQueryData = {
  query: "ba",
  searching: true,
  results: [],
}

const query1Result: ArtistQueryData = {
  query: "ban",
  searching: false,
  results: [
    {
      name: "Banksy",
      id: "banksy",
      image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
    },
  ],
}

const query1ResultSearching: ArtistQueryData = {
  query: "ban",
  searching: true,
  results: [
    {
      name: "Banksy",
      id: "banksy",
      image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
    },
  ],
}

const query2Results: ArtistQueryData = {
  query: "bank",
  searching: false,
  results: [
    {
      name: "Banksy",
      id: "banksy",
      image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
    },
    {
      name: "Banksy's Brother",
      id: "thanksy",
      image: { url: "https://d32dm0rphc51dk.cloudfront.net/zKBFBZPGN-V5TljXtsSuEg/square.jpg" },
    },
  ],
}

const artistGen = (name: string) => ({
  name,
  id: camelCase(name),
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
})

const query4Results: ArtistQueryData = {
  query: "bank",
  searching: false,
  results: [
    artistGen("Ada Van Hoorebeke"),
    artistGen("Kathleen Adair Brown"),
    artistGen("Linda Adair"),
    artistGen("Hector Adalid"),
  ],
}

export const allStates = [
  { "No query": noQuery },
  { "Looking for new results": queryNoResultsSearching },
  { "Found no results": queryNoResults },
  { "Found one result": query1Result },
  { "Found one result, and searching": query1ResultSearching },
  { "Found two results": query2Results },
  { "Found four results": query4Results },
]

const stories = storiesOf("Consignments - Search")
allStates.forEach(element => {
  const name = Object.keys(element)[0]
  stories.add(name, () =>
    <View style={{ flex: 1, backgroundColor: "black", padding: 20, marginTop: 60 }}>
      <Search {...element[name]} />
    </View>
  )
})
