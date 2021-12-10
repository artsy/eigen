import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { Artwork } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/ArtworksFilterHeader"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { isPad } from "lib/utils/hardware"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Box, Flex, Spacer, Spinner, Text, useSpace } from "palette"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { InfiniteHitsProvided, InstantSearch, SearchState, StateResultsProvided } from "react-instantsearch-core"
import { FlatList } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { AlgoliaSearchPlaceholder } from "./components/placeholders/AlgoliaSearchPlaceholder"
import { SearchResult } from "./components/SearchResult"
import { isAlgoliaApiKeyExpiredError } from "./helpers"
import RefinementList from "./RefinementList"
import { AlgoliaSearchResult } from "./types"

interface SearchResultsProps
  extends StateResultsProvided<AlgoliaSearchResult>,
    InfiniteHitsProvided<AlgoliaSearchResult> {
  indexName: string
  categoryDisplayName: string
  onRetry?: () => void
  trackResultPress?: (result: AlgoliaSearchResult) => void
  onSearchStateChange: Dispatch<SetStateAction<SearchState>>
  searchClient: any
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
  onSearchStateChange,
  searchClient,
}) => {
  const [showLoadingPlaceholder, setShowLoadingPlaceholder] = useState(true)
  const flatListRef = useRef<FlatList<AlgoliaSearchResult>>(null)
  const didMountRef = useRef(false)
  const loading = searching || isSearchStalled
  const space = useSpace()
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    })
  }, [indexName])

  useEffect(() => {
    setShowLoadingPlaceholder(true)
  }, [categoryDisplayName])

  // When we get the first search results, we hide the loading placeholder
  useEffect(() => {
    // Skips the initial mount
    if (didMountRef.current) {
      setShowLoadingPlaceholder(false)
    }

    didMountRef.current = true
  }, [searchResults?.hits])

  const openFilterModal = () => setIsModalVisible(true)
  const closeFilterModal = () => setIsModalVisible(false)

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
      <ProvidePlaceholderContext>
        <AlgoliaSearchPlaceholder hasRoundedImages={categoryDisplayName === "Artist"} />
      </ProvidePlaceholderContext>
    )
  }

  if (searchResults?.nbHits === 0) {
    const namesWithAnArticle = ["Artist", "Auction", "Artist Series"]
    const article = namesWithAnArticle.includes(categoryDisplayName) ? "an" : "a"

    return (
      <Box px={2} py={1}>
        <Spacer mt={4} />
        <Text variant="md" textAlign="center">
          Sorry, we couldn’t find {article} {categoryDisplayName} for “{searchState.query}.”
        </Text>
        <Text variant="md" color="black60" textAlign="center">
          Please try searching again with a different spelling.
        </Text>
      </Box>
    )
  }

  if (indexName.includes("Artwork_")) {
    return (
      <>
        <ArtworksFilterHeader selectedFiltersCount={0} onFilterPress={openFilterModal} childrenPosition="left" />
        <FlatList
          accessibilityLabel="Artworks Grid Results"
          contentContainerStyle={{ padding: space(1) }}
          numColumns={2}
          data={hits}
          keyExtractor={(item) => item.objectID}
          onEndReached={loadMore}
          renderItem={({ item }) => (
            <Flex flex={1} p={space(1)}>
              <Artwork artwork={item} />
            </Flex>
          )}
        />
        <FancyModal visible={isModalVisible} onBackgroundPressed={closeFilterModal}>
          <FancyModalHeader onLeftButtonPress={closeFilterModal} useXButton />
          <Flex flex={1}>
            <InstantSearch
              searchClient={searchClient}
              indexName="Artwork_staging"
              searchState={searchState}
              onSearchStateChange={onSearchStateChange}
            >
              <ScrollView>
                <RefinementList attribute="materials_terms" limit={15} />
                <RefinementList attribute="genes" limit={15} />
              </ScrollView>
            </InstantSearch>
          </Flex>
        </FancyModal>
      </>
    )
  }

  return (
    <AboveTheFoldFlatList<AlgoliaSearchResult>
      accessibilityLabel="Search Results List"
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
