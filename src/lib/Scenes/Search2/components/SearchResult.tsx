import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
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
  const addArtworkToRecentSearches = () => {
    GlobalStore.actions.search.addRecentSearch({
      type: "AUTOSUGGEST_RESULT_TAPPED",
      props: {
        imageUrl: result.image_url,
        href: result.href,
        slug: result.slug,
        displayLabel: result.name,
        __typename: categoryName,
        displayType: categoryName,
      },
    })
  }

  const onPress = (): void => {
    navigate(result.href)
    addArtworkToRecentSearches()

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
