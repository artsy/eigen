import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Spacer, Flex, Box } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { SearchQuery, SearchQuery$variables } from "__generated__/SearchQuery.graphql"
import { SearchInput } from "app/Components/SearchInput"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { useRefetchWhenQueryChanged } from "app/Scenes/Search/useRefetchWhenQueryChanged"
import { useSearchQuery } from "app/Scenes/Search/useSearchQuery"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { Schema } from "app/utils/track"
import { throttle } from "lodash"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Dimensions, Platform, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { CuratedCollections } from "./CuratedCollections"
import { RecentSearches } from "./RecentSearches"
import { SearchContext, useSearchProviderValues } from "./SearchContext"
import { SearchResults } from "./SearchResults"
import { TrendingArtists } from "./TrendingArtists"
import { CityGuideCTA } from "./components/CityGuideCTA"
import { SearchPlaceholder } from "./components/placeholders/SearchPlaceholder"
import { SEARCH_PILLS, SEARCH_THROTTLE_INTERVAL, TOP_PILL } from "./constants"
import { getContextModuleByPillName } from "./helpers"
import { PillType } from "./types"

// This is a workaround for the placeholder text not truncated on android
// See https://github.com/facebook/react-native/issues/29663
const SEARCH_INPUT_PLACEHOLDER =
  Platform.OS === "android" && Dimensions.get("screen").width - 150 < 250
    ? "Search artists, artworks,  etc"
    : "Search artists, artworks, galleries, etc"

export const searchQueryDefaultVariables: SearchQuery$variables = {
  term: "",
  skipSearchQuery: true,
}

export const Search: React.FC = () => {
  const searchPillsRef = useRef<ScrollView>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchProviderValues = useSearchProviderValues(searchQuery)
  const { trackEvent } = useTracking()
  const isAndroid = Platform.OS === "android"
  const navigation = useNavigation()

  const shouldShowCityGuide = Platform.OS === "ios" && !isTablet()
  const {
    data: queryData,
    refetch,
    isLoading,
  } = useSearchQuery<SearchQuery>(SearchScreenQuery, searchQueryDefaultVariables)

  useRefetchWhenQueryChanged({ query: searchQuery, refetch })

  const scrollableRef = useBottomTabsScrollToTop("search", () => {
    // Focus input and open keyboard on bottom nav Search tab double-tab
    searchProviderValues.inputRef.current?.focus()
  })

  // TODO: to be removed on ES results PR
  const handleRetry = () => {
    setSearchQuery((prevState) => prevState)
  }

  const handlePillPress = (pill: PillType) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    setSelectedPill(pill)
    trackEvent(tracks.tappedPill(contextModule, pill.displayName, searchQuery))
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.key === pill.key
  }

  const handleResetSearchInput = () => {
    searchPillsRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    setSelectedPill(TOP_PILL)
  }

  const handleThrottledTextChange = useMemo(
    () =>
      throttle((value) => {
        setSearchQuery(value)
      }, SEARCH_THROTTLE_INTERVAL),
    []
  )

  const onSearchTextChanged = (queryText: string) => {
    queryText = queryText.trim()

    handleThrottledTextChange(queryText)

    if (queryText.length === 0) {
      trackEvent({
        action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
      })
      handleResetSearchInput()

      handleThrottledTextChange.flush()

      return
    }

    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
      query: queryText,
    })
  }

  useEffect(() => {
    if (searchProviderValues.inputRef?.current && isAndroid) {
      const unsubscribe = navigation?.addListener("focus", () => {
        // setTimeout here is to make sure that the search screen is focused in order to focus on text input
        // without that the searchInput is not focused
        setTimeout(() => searchProviderValues.inputRef.current?.focus(), 200)
      })

      return unsubscribe
    }
  }, [navigation, searchProviderValues.inputRef.current])

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <ArtsyKeyboardAvoidingView>
        <Flex p={2} pb={0}>
          <SearchInput
            ref={searchProviderValues?.inputRef}
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            onChangeText={onSearchTextChanged}
          />
        </Flex>
        <Flex flex={1} collapsable={false}>
          {shouldStartSearching(searchQuery) && !!queryData.viewer ? (
            <>
              <Box pt={2} pb={1}>
                <SearchPills
                  viewer={queryData.viewer}
                  ref={searchPillsRef}
                  pills={SEARCH_PILLS}
                  onPillPress={handlePillPress}
                  isSelected={isSelected}
                  isLoading={isLoading}
                />
              </Box>
              <SearchResults
                selectedPill={selectedPill}
                query={searchQuery}
                // TODO: to be removed on ES results PR
                onRetry={handleRetry}
              />
            </>
          ) : (
            <Scrollable ref={scrollableRef}>
              <HorizontalPadding>
                <RecentSearches />
              </HorizontalPadding>

              <Spacer y={4} />
              <TrendingArtists data={queryData} mb={4} />
              <CuratedCollections collections={queryData} mb={4} />

              <HorizontalPadding>{!!shouldShowCityGuide && <CityGuideCTA />}</HorizontalPadding>

              <Spacer y={4} />
            </Scrollable>
          )}
        </Flex>
      </ArtsyKeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

export const SearchScreenQuery = graphql`
  query SearchQuery($term: String!, $skipSearchQuery: Boolean!) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
    ...CuratedCollections_collections
    ...TrendingArtists_query
  }
`

export const SearchScreen: React.FC = () => (
  <Suspense fallback={<SearchPlaceholder />}>
    <Search />
  </Suspense>
)

const Scrollable = styled(ScrollView).attrs(() => ({
  keyboardDismissMode: "on-drag",
  keyboardShouldPersistTaps: "handled",
}))`
  flex: 1;
  padding-top: 20px;
`

const HorizontalPadding: React.FC = ({ children }) => {
  return <Box px={2}>{children}</Box>
}

const tracks = {
  tappedPill: (contextModule: ContextModule, subject: string, query: string) => ({
    context_screen_owner_type: OwnerType.search,
    context_screen: Schema.PageNames.Search,
    context_module: contextModule,
    subject,
    query,
    action: ActionType.tappedNavigationTab,
  }),
}

const shouldStartSearching = (value: string) => {
  return value.length >= 2
}
