import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate, navigateToPartner } from "lib/navigation/navigate"
import { isPad } from "lib/utils/hardware"
import { searchInsights } from "lib/utils/useSearchInsightsConfig"
import { Box, Flex, Spacer, Spinner, Text, Touchable, useSpace } from "palette"
import React, { useEffect, useRef } from "react"
import { InfiniteHitsProvided, StateResultsProvided } from "react-instantsearch-core"
import { connectHighlight } from "react-instantsearch-native"
import { FlatList } from "react-native"
import { AlgoliaSearchResult } from "./types"

interface SearchResultsProps
  extends StateResultsProvided<AlgoliaSearchResult>,
    InfiniteHitsProvided<AlgoliaSearchResult> {
  indexName: string
  categoryDisplayName: string
}

const Highlight = connectHighlight(({ highlight, attribute, hit, highlightProperty = "_highlightResult" }) => {
  const parsedHit = highlight({ attribute, hit, highlightProperty })

  return (
    <Text numberOfLines={1}>
      {parsedHit.map(({ isHighlighted, value }, index) =>
        isHighlighted ? (
          <Text key={index} color="blue100" fontWeight="600" padding={0} margin={0}>
            {value}
          </Text>
        ) : (
          <Text key={index}>{value}</Text>
        )
      )}
    </Text>
  )
})

export const SearchResults: React.FC<SearchResultsProps> = ({
  hits,
  hasMore,
  searching,
  isSearchStalled,
  searchState,
  indexName,
  refineNext,
  categoryDisplayName,
}) => {
  const flatListRef = useRef<FlatList<AlgoliaSearchResult>>(null)
  const loading = searching || isSearchStalled
  const space = useSpace()

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 1, animated: true })
  }, [searchState.query, indexName])

  const onPress = (item: AlgoliaSearchResult): void => {
    // TODO: I'm not sure why we need to use this `navigateToPartner` function but without it the header overlaps
    // with the back button
    if (item.href.startsWith("/partner/")) {
      navigateToPartner(item.slug)
    } else {
      navigate(item.href)
    }

    searchInsights("clickedObjectIDsAfterSearch", {
      index: indexName,
      eventName: "Search item clicked",
      positions: [item.__position],
      queryID: item.__queryID,
      objectIDs: [item.objectID],
    })
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      refineNext()
    }
  }

  if (!hits.length) {
    return (
      <Box px={2} py={1}>
        <Spacer mt={4} />
        <Text variant="subtitle">
          No {categoryDisplayName} found for “{searchState.query}”.
        </Text>
        <Text variant="subtitle" color="black60">
          Look at a different category or try another search term.
        </Text>
      </Box>
    )
  }

  return (
    <AboveTheFoldFlatList<AlgoliaSearchResult>
      listRef={flatListRef}
      initialNumToRender={isPad() ? 24 : 12}
      contentContainerStyle={{ paddingVertical: space(1) }}
      data={hits}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item }) => (
        <Touchable onPress={() => onPress(item)}>
          <Flex py={space(1)} px={space(2)} flexDirection="row" alignItems="center">
            <OpaqueImageView
              imageURL={item.image_url}
              style={{ width: 40, height: 40, borderRadius: 20, overflow: "hidden" }}
            />
            <Spacer ml={1} />
            <Flex flex={1}>
              <Highlight attribute="name" hit={item} />
            </Flex>
          </Flex>
        </Touchable>
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
