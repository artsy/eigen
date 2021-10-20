import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { isPad } from "lib/utils/hardware"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Box, Flex, Spacer, Spinner, Text, useSpace } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { InfiniteHitsProvided, StateResultsProvided } from "react-instantsearch-core"
import { FlatList } from "react-native"
import { AlgoliaSearchPlaceholder } from "./components/AlgoliaSearchPlaceholder"
import { SearchResult } from "./components/SearchResult"
import { AlgoliaSearchResult } from "./types"

interface SearchResultsProps
  extends StateResultsProvided<AlgoliaSearchResult>,
    InfiniteHitsProvided<AlgoliaSearchResult> {
  indexName: string
  categoryDisplayName: string
  onRetry?: () => void
  trackResultPress?: (result: AlgoliaSearchResult) => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  hits,
  hasMore,
  searching,
  isSearchStalled,
  searchState,
  indexName,
  searchResults,
  categoryDisplayName,
  error,
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
  }, [indexName])

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

  if (hits.length === 0 && error && !loading) {
    return <LoadFailureView onRetry={onRetry} />
  }

  if (showLoadingPlaceholder) {
    return (
      <ProvidePlaceholderContext>
        <AlgoliaSearchPlaceholder />
      </ProvidePlaceholderContext>
    )
  }

  if (searchResults?.nbHits === 0) {
    return (
      <Box px={2} py={1}>
        <Spacer mt={4} />
        <Text variant="md">
          No {categoryDisplayName} found for “{searchState.query}.”
        </Text>
        <Text variant="md" color="black60">
          Look at a different category or try another search term.
        </Text>
      </Box>
    )
  }

  return (
    <AboveTheFoldFlatList<AlgoliaSearchResult>
      listRef={flatListRef}
      initialNumToRender={isPad() ? 24 : 12}
      contentContainerStyle={{ paddingVertical: space(1), paddingHorizontal: space(2) }}
      data={hits}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <Spacer mb={2} />}
      renderItem={({ item }) => (
        <SearchResult
          result={item}
          indexName={indexName}
          categoryName={categoryDisplayName}
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
