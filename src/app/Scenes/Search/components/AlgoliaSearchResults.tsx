import { Spacer, Flex, useSpace } from "@artsy/palette-mobile"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { SingleIndexEmptyResultsMessage } from "app/Scenes/Search/components/SingleIndexEmptyResultsMessage"
import { SingleIndexSearchPlaceholder } from "app/Scenes/Search/components/placeholders/SingleIndexSearchPlaceholder"
import { isAlgoliaApiKeyExpiredError } from "app/Scenes/Search/helpers"
import { AlgoliaIndexKey, AlgoliaSearchResult, PillType } from "app/Scenes/Search/types"
import { isPad } from "app/utils/hardware"
import { Spinner } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { InfiniteHitsProvided, StateResultsProvided } from "react-instantsearch-core"
import { FlatList } from "react-native"
import { SearchResult } from "./SearchResult"

interface AlgoliaSearchResultsProps
  extends StateResultsProvided<AlgoliaSearchResult>,
    InfiniteHitsProvided<AlgoliaSearchResult> {
  selectedPill: PillType
  onRetry?: () => void
  trackResultPress?: (result: AlgoliaSearchResult) => void
}

export const AlgoliaSearchResults: React.FC<AlgoliaSearchResultsProps> = ({
  hits,
  hasMore,
  searching,
  isSearchStalled,
  searchState,
  searchResults,
  error,
  selectedPill,
  onRetry,
  refineNext,
  trackResultPress,
}) => {
  const [showLoadingPlaceholder, setShowLoadingPlaceholder] = useState(true)
  const flatListRef = useRef<FlatList<AlgoliaSearchResult>>(null)
  const didMountRef = useRef(false)
  const loading = searching || isSearchStalled
  const space = useSpace()

  useEffect(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    })
  }, [selectedPill.indexName])

  useEffect(() => {
    setShowLoadingPlaceholder(true)
  }, [selectedPill.displayName])

  // When we get the first search results, we hide the loading placeholder
  useEffect(() => {
    // Skips the initial mount
    if (didMountRef.current) {
      setShowLoadingPlaceholder(false)
    }

    didMountRef.current = true
  }, [searchResults?.hits])

  const loadMore = () => {
    if (hasMore && !loading) {
      refineNext()
    }
  }

  if (hits.length === 0 && error && !isAlgoliaApiKeyExpiredError(error) && !loading) {
    return <LoadFailureView onRetry={onRetry} />
  }

  if (showLoadingPlaceholder) {
    return (
      <SingleIndexSearchPlaceholder
        hasRoundedImages={selectedPill.key === AlgoliaIndexKey.Artist}
      />
    )
  }

  if (searchResults?.nbHits === 0) {
    return <SingleIndexEmptyResultsMessage query={searchState.query!} selectedPill={selectedPill} />
  }

  return (
    <AboveTheFoldFlatList<AlgoliaSearchResult>
      listRef={flatListRef}
      initialNumToRender={isPad() ? 24 : 12}
      contentContainerStyle={{ paddingVertical: space(1), paddingHorizontal: space(2) }}
      data={hits}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      renderItem={({ item }) => (
        <SearchResult
          result={item}
          selectedPill={selectedPill}
          trackResultPress={trackResultPress}
        />
      )}
      onEndReached={loadMore}
      ListFooterComponent={
        <Flex alignItems="center" my={2}>
          {loading ? <Spinner /> : null}
        </Flex>
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    />
  )
}
