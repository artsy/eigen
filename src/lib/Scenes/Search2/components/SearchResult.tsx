import { navigate } from "lib/navigation/navigate"
import { searchInsights } from "lib/utils/useSearchInsightsConfig"
import { Flex, Spacer, Touchable } from "palette"
import React from "react"
import { AlgoliaSearchResult } from "../types"
import { SearchHighlight } from "./SearchHighlight"
import { SearchResultImage } from "./SearchResultImage"

const IMAGE_SIZE = 40

interface SearchResultsItemProps {
  result: AlgoliaSearchResult
  categoryName: string
  indexName: string
  trackResultPress?: (result: AlgoliaSearchResult) => void
}

export const SearchResult: React.FC<SearchResultsItemProps> = ({
  result,
  categoryName,
  indexName,
  trackResultPress,
}) => {
  const onPress = (): void => {
    navigate(result.href)

    trackResultPress?.(result)
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

        <Spacer ml={1} />

        <Flex flex={1}>
          <SearchHighlight attribute="name" hit={result} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
