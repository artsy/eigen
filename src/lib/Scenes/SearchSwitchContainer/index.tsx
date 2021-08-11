import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { AlgoliaSearch } from "../AlgoliaSearch/AlgoliaSearch"
import { Search } from "../Search"

// The purpose of this screen is to decide which search screen to render
// depending on the value of AREnableAlgoliaSearch feature flag.

export const SearchSwitchContainer: React.FC = () => {
  const showAlgoliaSearch = useFeatureFlag("AREnableAlgoliaSearch")
  return showAlgoliaSearch ? <AlgoliaSearch /> : <Search />
}
