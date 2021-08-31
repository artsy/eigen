import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { Search } from "../Search"
import { Search2QueryRenderer as Search2 } from "../Search2/Search2"

// The purpose of this screen is to decide which search screen to render
// depending on the value of AREnableImprovedSearch feature flag.

export const SearchSwitchContainer: React.FC = () => {
  const showAlgoliaSearch = useFeatureFlag("AREnableImprovedSearch")
  return showAlgoliaSearch ? <Search2 /> : <Search />
}
