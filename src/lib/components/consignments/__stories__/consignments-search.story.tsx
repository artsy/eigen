import { storiesOf } from "@storybook/react-native"
import {camelCase} from "lodash"
import * as React from "react"

import Search from "../components/artist-search-results"

interface ArtistQueryData {
  query: string,
  searching: boolean,
  results: Array<{ name: string, id: string, image: { url: string } }> | null
}

const noQuery: ArtistQueryData = {
  query: "",
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
  results: [
    artistGen("Ada Van Hoorebeke"), artistGen("Kathleen Adair Brown"),
    artistGen("Linda Adair"), artistGen("Hector Adalid"),
  ],
}

export const allStates = {
  noQuery,
  queryNoResults,
  query1Result,
  query2Results,
  query4Results,
}

storiesOf("Consignments - TODO")
  .add("With No Query", () => <Search {...withArtist} />)
  .add("With Query ", () => <Search {...withArtist} />)
  .add("With One Result", () => <Search {...withPhotos} />)
  .add("With Two Results", () => <Search {...withMetadata} />)
  .add("With Four Results", () => <Search {...withLocation} />)
