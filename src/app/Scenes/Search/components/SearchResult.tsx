import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { searchInsights } from "app/utils/useSearchInsightsConfig"
import { Flex, Spacer, Touchable } from "palette"
import React from "react"
import { AlgoliaSearchResult, PillType } from "../types"
import { SearchHighlight } from "./SearchHighlight"
import { IMAGE_SIZE, SearchResultImage } from "./SearchResultImage"

interface SearchResultsItemProps {
  result: AlgoliaSearchResult
  selectedPill: PillType
  trackResultPress?: (result: AlgoliaSearchResult) => void
}

export const SearchResult: React.FC<SearchResultsItemProps> = ({
  result,
  selectedPill,
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
        __typename: selectedPill.displayName,
        displayType: selectedPill.displayName,
      },
    })
  }

  const onPress = (): void => {
    navigate(result.href)
    addArtworkToRecentSearches()

    trackResultPress?.(result)
    searchInsights("clickedObjectIDsAfterSearch", {
      index: selectedPill.indexName!,
      eventName: "Search item clicked",
      positions: [result.__position],
      queryID: result.__queryID,
      objectIDs: [result.objectID],
    })
  }

  return (
    <Touchable onPress={onPress}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage imageURL={result.image_url} resultType={selectedPill.displayName} />

        <Spacer ml={1} />

        <Flex flex={1}>
          <SearchHighlight attribute="name" hit={result} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
