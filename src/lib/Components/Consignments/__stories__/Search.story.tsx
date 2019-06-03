import { camelCase } from "lodash"

import { SearchQueryProps, SearchResults } from "../Components/SearchResults"

export const name = "Consignments/Search"
export const component = SearchResults

const noQuery: SearchQueryProps = {
  query: null,
  searching: false,
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
  results: [],
}

const queryNoResults: SearchQueryProps = {
  query: "ba",
  searching: false,
  results: [],
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
}

const queryNoResultsSearching: SearchQueryProps = {
  query: "ba",
  searching: true,
  results: [],
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
}

const query1Result: SearchQueryProps = {
  query: "ban",
  searching: false,
  results: [
    {
      name: "Banksy",
      id: "banksy",
      image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
    },
  ],
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
}

const query1ResultSearching: SearchQueryProps = {
  query: "ban",
  searching: true,
  results: [
    {
      name: "Banksy",
      id: "banksy",
      image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
    },
  ],
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
}

const query2Results: SearchQueryProps = {
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
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
}

const artistGen = (artistName: string) => ({
  name: artistName,
  id: camelCase(artistName),
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg" },
})

const query4Results: SearchQueryProps = {
  query: "bank",
  searching: false,
  results: [
    artistGen("Ada Van Hoorebeke"),
    artistGen("Kathleen Adair Brown"),
    artistGen("Linda Adair"),
    artistGen("Hector Adalid"),
  ],
  placeholder: "Artist/Designer Name",
  noResultsMessage: "Unfortunately we are not accepting consignments for works by",
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
