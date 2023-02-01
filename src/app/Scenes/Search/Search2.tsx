import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { useNavigation } from "@react-navigation/native"
import { Search2Query } from "__generated__/Search2Query.graphql"
import { SearchInput } from "app/Components/SearchInput"
import { RefetchSearchTermQuery } from "app/Scenes/Search/RefetchSearchTermQuery"
import { SearchPills2 } from "app/Scenes/Search/SearchPills2"
import { isPad } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Box, Flex, Spacer } from "palette"
import { Suspense, useEffect, useRef, useState } from "react"
import { Platform, ScrollView } from "react-native"
import {
  FetchPolicy,
  fetchQuery,
  graphql,
  useLazyLoadQuery,
  useRelayEnvironment,
} from "react-relay"
import { useTracking } from "react-tracking"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import styled from "styled-components"
import { CuratedCollections } from "./CuratedCollections"
import { RecentSearches } from "./RecentSearches"
import { SearchContext, useSearchProviderValues } from "./SearchContext"
import { SearchResults } from "./SearchResults"
import { TrendingArtists } from "./TrendingArtists"
import { CityGuideCTA } from "./components/CityGuideCTA"
import { SearchPlaceholder } from "./components/placeholders/SearchPlaceholder"
import { ES_ONLY_PILLS, TOP_PILL } from "./constants"
import { getContextModuleByPillName } from "./helpers"
import { PillType } from "./types"
import { useSearchDiscoveryContentEnabled } from "./useSearchDiscoveryContentEnabled"

interface SearchState {
  query?: string
  page?: number
}

interface RefreshQueryOptions {
  fetchKey?: number
  fetchPolicy?: FetchPolicy
}

const SEARCH_INPUT_PLACEHOLDER = "Search artists, artworks, galleries, etc"

export const Search2: React.FC = () => {
  const environment = useRelayEnvironment()

  const isSearchDiscoveryContentEnabled = useSearchDiscoveryContentEnabled()

  const searchPillsRef = useRef<ScrollView>(null)
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchQuery = searchState?.query ?? ""
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchProviderValues = useSearchProviderValues(searchQuery)
  const { trackEvent } = useTracking()
  const isAndroid = Platform.OS === "android"
  const navigation = useNavigation()
  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState<RefreshQueryOptions>({})
  const queryData = useLazyLoadQuery<Search2Query>(
    SearchScreenQuery,
    { term: "" },
    refreshedQueryOptions
  )

  const onRefetch = () => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    fetchQuery(environment, SearchScreenQuery, { term: searchQuery }).subscribe({
      complete: () => {
        setIsRefreshing(false)

        setRefreshedQueryOptions((prev) => ({
          fetchKey: (prev?.fetchKey ?? 0) + 1,
          fetchPolicy: "store-only",
        }))
      },
      error: () => {
        setIsRefreshing(false)
      },
    })
  }

  const handleRetry = () => {
    setSearchState((prevState) => ({ ...prevState }))
  }

  const handlePillPress = (pill: PillType) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    setSearchState((prevState) => ({ ...prevState, page: 1 }))
    setSelectedPill(pill)
    trackEvent(tracks.tappedPill(contextModule, pill.displayName, searchState.query!))
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.key === pill.key
  }

  const handleResetSearchInput = () => {
    searchPillsRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    setSelectedPill(TOP_PILL)
  }

  const onSearchTextChanged = (queryText: string) => {
    if (queryText.length === 0) {
      trackEvent({
        action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
      })
      handleResetSearchInput()
    }

    queryText = queryText.trim()
    setSearchState((state) => ({ ...state, query: queryText }))
    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
      query: queryText,
    })
  }

  const renderCityGuideCTA = () => {
    if (Platform.OS === "ios" && !isPad()) {
      return <CityGuideCTA />
    }

    return null
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
            enableCancelButton
            onChangeText={onSearchTextChanged}
          />
        </Flex>
        <RefetchSearchTermQuery query={searchQuery} refetch={onRefetch} />
        <Flex flex={1} collapsable={false}>
          {shouldStartSearching(searchQuery) && queryData.viewer !== null ? (
            <>
              <Box pt={2} pb={1}>
                <SearchPills2
                  viewer={queryData.viewer}
                  ref={searchPillsRef}
                  pills={ES_ONLY_PILLS}
                  onPillPress={handlePillPress}
                  isSelected={isSelected}
                />
              </Box>
              <SearchResults
                selectedPill={selectedPill}
                query={searchQuery}
                onRetry={handleRetry}
              />
            </>
          ) : (
            <Scrollable>
              <HorizontalPadding>
                <RecentSearches />
              </HorizontalPadding>

              {!!isSearchDiscoveryContentEnabled ? (
                <>
                  <Spacer mb={4} />
                  <TrendingArtists data={queryData} mb={4} />
                  <CuratedCollections collections={queryData} mb={4} />
                </>
              ) : (
                <Spacer mb={4} />
              )}

              <HorizontalPadding>{renderCityGuideCTA()}</HorizontalPadding>

              <Spacer mb={4} />
            </Scrollable>
          )}
        </Flex>
      </ArtsyKeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

export const SearchScreenQuery = graphql`
  query Search2Query($term: String!) {
    viewer {
      ...SearchPills2_viewer @arguments(term: $term)
    }
    ...CuratedCollections_collections
    ...TrendingArtists_query
  }
`

export const SearchScreen2: React.FC = () => (
  <Suspense fallback={<SearchPlaceholder />}>
    <Search2 />
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
