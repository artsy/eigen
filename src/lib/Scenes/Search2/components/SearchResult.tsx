import { navigate, navigateToPartner } from "lib/navigation/navigate"
import { searchInsights } from "lib/utils/useSearchInsightsConfig"
import React from "react"
import { AlgoliaSearchResult } from "../types"
import { SearchHighlight } from "./SearchHighlight"
import { SearchListItem } from "./SearchListItem"

interface SearchResultsItemProps {
  result: AlgoliaSearchResult
  indexName: string
}

export const SearchResult: React.FC<SearchResultsItemProps> = ({ result, indexName }) => {
  const categoryName = indexName.split("_")[0]

  const onPress = (): void => {
    // TODO: I'm not sure why we need to use this `navigateToPartner` function but without it the header overlaps
    // with the back button
    if (result.href.startsWith("/partner/")) {
      navigateToPartner(result.slug)
    } else {
      navigate(result.href)
    }

    searchInsights("clickedObjectIDsAfterSearch", {
      index: indexName,
      eventName: "Search item clicked",
      positions: [result.__position],
      queryID: result.__queryID,
      objectIDs: [result.objectID],
    })
  }

  return (
    <SearchListItem
      onPress={onPress}
      imageURL={result.image_url}
      categoryName={categoryName}
      InfoComponent={() => {
        return <SearchHighlight attribute="name" hit={result} />
      }}
    />
  )
}
