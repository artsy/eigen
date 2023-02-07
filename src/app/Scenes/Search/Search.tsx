import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Spacer } from "@artsy/palette-mobile"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { isPad } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { useAlgoliaClient } from "app/utils/useAlgoliaClient"
import { useAlgoliaIndices } from "app/utils/useAlgoliaIndices"
import { useSearchInsightsConfig } from "app/utils/useSearchInsightsConfig"
import { Box, Flex } from "palette"
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Configure, connectSearchBox, InstantSearch } from "react-instantsearch-native"
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
import { RefetchWhenApiKeyExpiredContainer } from "./RefetchWhenApiKeyExpired"
import { SearchContext, useSearchProviderValues } from "./SearchContext"
import { SearchResults } from "./SearchResults"
import { TrendingArtists } from "./TrendingArtists"
import { CityGuideCTA } from "./components/CityGuideCTA"
import { SearchInput } from "./components/SearchInput"
import { SearchPills } from "./components/SearchPills"
import { SearchPlaceholder } from "./components/placeholders/SearchPlaceholder"
import { ALLOWED_ALGOLIA_KEYS, DEFAULT_PILLS, TOP_PILL } from "./constants"
import { getContextModuleByPillName, isAlgoliaApiKeyExpiredError } from "./helpers"
import { AlgoliaIndexKey, PillType } from "./types"
import { useSearchDiscoveryContentEnabled } from "./useSearchDiscoveryContentEnabled"

const SearchInputContainer = connectSearchBox(SearchInput)

interface SearchState {
  query?: string
  page?: number
}

interface RefreshQueryOptions {
  fetchKey?: number
  fetchPolicy?: FetchPolicy
}

export const Search: React.FC = () => {
  const environment = useRelayEnvironment()
  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState<RefreshQueryOptions>({})
  const queryData = useLazyLoadQuery<SearchQuery>(SearchScreenQuery, {}, refreshedQueryOptions)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { system } = queryData
  const indices = system?.algolia?.indices ?? []
  const indiceNames = indices.map((indice) => indice.name)
  const isSearchDiscoveryContentEnabled = useSearchDiscoveryContentEnabled()
  const onRefetch = () => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    fetchQuery(environment, SearchScreenQuery, {}).subscribe({
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

  const searchPillsRef = useRef<ScrollView>(null)
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchQuery = searchState?.query ?? ""
  const searchProviderValues = useSearchProviderValues(searchQuery)
  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)
  const searchInsightsConfigured = useSearchInsightsConfig(
    system?.algolia?.appID,
    system?.algolia?.apiKey
  )
  const {
    loading: indicesInfoLoading,
    indicesInfo,
    updateIndicesInfo,
  } = useAlgoliaIndices({
    searchClient,
    indiceNames,
    onError: (error: Error) => {
      if (isAlgoliaApiKeyExpiredError(error)) {
        onRefetch()
      }
    },
  })
  const { trackEvent } = useTracking()

  const pillsArray = useMemo<PillType[]>(() => {
    const allowedIndices = indices.filter((indice) =>
      ALLOWED_ALGOLIA_KEYS.includes(indice.key as AlgoliaIndexKey)
    )
    const formattedIndices: PillType[] = allowedIndices.map((index) => {
      const { name, ...other } = index

      return {
        ...other,
        type: "algolia",
        disabled: !indicesInfo[name]?.hasResults,
        indexName: name,
      }
    })

    return [...DEFAULT_PILLS, ...formattedIndices]
  }, [indices, indicesInfo])

  useEffect(() => {
    /**
     * Refetch up-to-date info about Algolia indices for specified search query
     * when Algolia API key expired and request failed (we get a fresh Algolia API key and send request again)
     */
    if (searchClient && shouldStartSearching(searchQuery)) {
      updateIndicesInfo(searchQuery)
    }
  }, [searchClient])

  const onTextChange = useCallback(
    (value: string) => {
      if (value.length === 0) {
        handleResetSearchInput()
      }

      if (shouldStartSearching(value)) {
        updateIndicesInfo(value)
      }
    },
    [searchClient]
  )

  if (!searchClient || !searchInsightsConfigured) {
    return <SearchPlaceholder />
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

  const renderCityGuideCTA = () => {
    if (Platform.OS === "ios" && !isPad()) {
      return <CityGuideCTA />
    }

    return null
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <ArtsyKeyboardAvoidingView>
        <InstantSearch
          searchClient={searchClient}
          indexName={selectedPill.type === "algolia" ? selectedPill.indexName! : ""}
          searchState={searchState}
          onSearchStateChange={setSearchState}
        >
          <Configure clickAnalytics />
          <RefetchWhenApiKeyExpiredContainer refetch={onRefetch} />
          <Flex p={2} pb={0}>
            <SearchInputContainer
              placeholder="Search artists, artworks, galleries, etc"
              onTextChange={onTextChange}
            />
          </Flex>

          <Flex flex={1} collapsable={false}>
            {shouldStartSearching(searchQuery) ? (
              <>
                <Box pt={2} pb={1}>
                  <SearchPills
                    ref={searchPillsRef}
                    loading={indicesInfoLoading}
                    pills={pillsArray}
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
                    <Spacer y="4" />
                    <TrendingArtists data={queryData} mb={4} />
                    <CuratedCollections collections={queryData} mb={4} />
                  </>
                ) : (
                  <Spacer y="4" />
                )}

                <HorizontalPadding>{renderCityGuideCTA()}</HorizontalPadding>

                <Spacer y="4" />
              </Scrollable>
            )}
          </Flex>
        </InstantSearch>
      </ArtsyKeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

export const SearchScreenQuery = graphql`
  query SearchQuery {
    system {
      __typename
      algolia {
        appID
        apiKey
        indices {
          name
          displayName
          key
        }
      }
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
