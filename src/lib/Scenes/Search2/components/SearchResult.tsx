import { navigate, navigateToPartner } from "lib/navigation/navigate"
import { searchInsights } from "lib/utils/useSearchInsightsConfig"
import { Flex, Touchable } from "palette"
import React from "react"
import { AlgoliaSearchResult } from "../types"
import { SearchHighlight } from "./SearchHighlight"
import { SearchResultImage } from "./SearchResultImage"

const IMAGE_SIZE = 40

interface SearchResultsItemProps {
  result: AlgoliaSearchResult
  categoryName: string
  indexName: string
}

export const SearchResult: React.FC<SearchResultsItemProps> = ({ result, categoryName, indexName }) => {
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
    <Touchable onPress={onPress}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage imageURL={result.image_url} resultType={categoryName} />

        <Flex flex={1}>
          <SearchHighlight attribute="name" hit={result} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
