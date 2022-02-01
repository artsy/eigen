import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { Search_system } from "__generated__/Search_system.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { isPad } from "lib/utils/hardware"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Schema } from "lib/utils/track"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { useAlgoliaIndices } from "lib/utils/useAlgoliaIndices"
import { useSearchInsightsConfig } from "lib/utils/useSearchInsightsConfig"
import { Box, Flex, Spacer } from "palette"
import React, { useMemo, useRef, useState } from "react"
import {
  Configure,
  connectInfiniteHits,
  connectSearchBox,
  connectStateResults,
  InstantSearch,
} from "react-instantsearch-native"
import { Keyboard, Platform, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components"
import { AutosuggestResult, AutosuggestResults } from "./AutosuggestResults"
import { CityGuideCTA } from "./components/CityGuideCTA"
import { SearchPlaceholder } from "./components/placeholders/SearchPlaceholder"
import { SearchInput } from "./components/SearchInput"
import { SearchPills } from "./components/SearchPills"
import { ALLOWED_ALGOLIA_KEYS } from "./constants"
import { getContextModuleByPillName } from "./helpers"
import { RecentSearches } from "./RecentSearches"
import { RefetchWhenApiKeyExpiredContainer } from "./RefetchWhenApiKeyExpired"
import { SearchArtworksQueryRenderer } from "./SearchArtworksContainer"
import { SearchContext, useSearchProviderValues } from "./SearchContext"
import { SearchResults } from "./SearchResults"
import { AlgoliaIndexKey } from "./types"
import { AlgoliaSearchResult, PillType } from "./types"

interface TappedSearchResultData {
  query: string
  type: string
  position: number
  contextModule: ContextModule
  slug: string
  objectTab?: string
}

const SearchInputContainer = connectSearchBox(SearchInput)
const SearchResultsContainerWithState = connectStateResults(SearchResults)
const SearchResultsContainer = connectInfiniteHits(SearchResultsContainerWithState)

interface SearchState {
  query?: string
  page?: number
}

const TOP_PILL: PillType = {
  displayName: "Top",
  type: "elastic",
  key: "top",
}
const ARTWORKS_PILL: PillType = {
  displayName: "Artworks",
  type: "elastic",
  key: "artworks",
}
const pills: PillType[] = [TOP_PILL, ARTWORKS_PILL]

const objectTabByContextModule: Partial<Record<ContextModule, string>> = {
  [ContextModule.auctionTab]: "Auction Results",
  [ContextModule.artistsTab]: "Artworks",
}

interface SearchProps {
  relay: RelayRefetchProp
  system: Search_system | null
}

export const Search: React.FC<SearchProps> = (props) => {
  const { system, relay } = props
  const searchPillsRef = useRef<ScrollView>(null)
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchProviderValues = useSearchProviderValues(searchState?.query ?? "")
  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)
  const searchInsightsConfigured = useSearchInsightsConfig(
    system?.algolia?.appID,
    system?.algolia?.apiKey
  )
  const indices = system?.algolia?.indices
  const {
    loading: indicesInfoLoading,
    indicesInfo,
    updateIndicesInfo,
  } = useAlgoliaIndices(searchClient, indices)
  const { trackEvent } = useTracking()
  const enableImprovedPills = useFeatureFlag("AREnableImprovedSearchPills")

  const pillsArray = useMemo<PillType[]>(() => {
    if (Array.isArray(indices) && indices.length > 0) {
      const allowedIndices = (indices as NonNullable<Search_system["algolia"]>["indices"]).filter(
        (indice) => ALLOWED_ALGOLIA_KEYS.includes(indice.key as AlgoliaIndexKey)
      )
      const formattedIndices: PillType[] = allowedIndices.map((index) => {
        const { name, ...other } = index

        return {
          ...other,
          type: "algolia",
          disabled: enableImprovedPills && !indicesInfo[name]?.hasResults,
          indexName: name,
        }
      })

      return [...pills, ...formattedIndices]
    }

    return pills
  }, [indices, indicesInfo])

  if (!searchClient || !searchInsightsConfigured) {
    return (
      <ProvidePlaceholderContext>
        <SearchPlaceholder />
      </ProvidePlaceholderContext>
    )
  }

  const handleRetry = () => {
    setSearchState((prevState) => ({ ...prevState }))
  }

  const renderResults = () => {
    if (selectedPill.type === "algolia") {
      return (
        <SearchResultsContainer
          selectedPill={selectedPill}
          onRetry={handleRetry}
          trackResultPress={handleTrackAlgoliaResultPress}
        />
      )
    }
    if (selectedPill.key === TOP_PILL.key) {
      return (
        <AutosuggestResults
          query={searchState.query!}
          showResultType
          showQuickNavigationButtons
          showOnRetryErrorMessage
          trackResultPress={handleTrackAutosuggestResultPress}
        />
      )
    }
    return <SearchArtworksQueryRenderer keyword={searchState.query!} />
  }

  const shouldStartQuering = !!searchState?.query?.length && searchState?.query.length >= 2

  const handlePillPress = (pill: PillType) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    setSearchState((prevState) => ({ ...prevState, page: 1 }))
    setSelectedPill(pill)
    Keyboard.dismiss()
    trackEvent(tracks.tappedPill(contextModule, pill.displayName, searchState.query!))
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.key === pill.key
  }

  const handleResetSearchInput = () => {
    searchPillsRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    setSelectedPill(TOP_PILL)
  }

  const handleTrackAutosuggestResultPress = (result: AutosuggestResult, itemIndex?: number) => {
    trackEvent(
      tracks.tappedSearchResult({
        type: result.displayType || result.__typename,
        slug: result.slug!,
        position: itemIndex!,
        query: searchState.query!,
        contextModule: ContextModule.topTab,
      })
    )
  }

  const handleTrackAlgoliaResultPress = (result: AlgoliaSearchResult) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    const data: TappedSearchResultData = {
      type: selectedPill.displayName,
      slug: result.slug,
      position: result.__position - 1,
      query: searchState.query!,
      contextModule: contextModule!,
    }

    if (contextModule && objectTabByContextModule[contextModule]) {
      data.objectTab = objectTabByContextModule[contextModule]
    }

    trackEvent(tracks.tappedSearchResult(data))
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
          <RefetchWhenApiKeyExpiredContainer relay={relay} />
          <Flex p={2} pb={1}>
            <SearchInputContainer
              placeholder="Search artists, artworks, galleries, etc"
              onTextChange={(value) => {
                handleResetSearchInput()

                if (enableImprovedPills && value.length >= 2) {
                  updateIndicesInfo(value)
                }
              }}
            />
          </Flex>
          <Flex flex={1} collapsable={false}>
            {!!shouldStartQuering ? (
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
                {renderResults()}
              </>
            ) : (
              <Scrollable>
                <RecentSearches />
                <Spacer mb={3} />
                {!isPad() && Platform.OS === "ios" && <CityGuideCTA />}
                <Spacer mb="40px" />
              </Scrollable>
            )}
          </Flex>
        </InstantSearch>
      </ArtsyKeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

const SearchRefetchContainer = createRefetchContainer(
  Search,
  {
    system: graphql`
      fragment Search_system on System {
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
    `,
  },
  graphql`
    query SearchRefetchQuery {
      system {
        ...Search_system
      }
    }
  `
)

export const SearchScreenQuery = graphql`
  query SearchQuery {
    system {
      ...Search_system
    }
  }
`

export const SearchQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<SearchQuery>
      environment={defaultEnvironment}
      query={SearchScreenQuery}
      render={({ props, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        return <SearchRefetchContainer system={props?.system ?? null} />
      }}
      variables={{}}
    />
  )
}

const Scrollable = styled(ScrollView).attrs(() => ({
  keyboardDismissMode: "on-drag",
  keyboardShouldPersistTaps: "handled",
}))`
  flex: 1;
  padding: 0 20px;
  padding-top: 20px;
`

export const tracks = {
  tappedPill: (contextModule: ContextModule, subject: string, query: string) => ({
    context_screen_owner_type: OwnerType.search,
    context_screen: Schema.PageNames.Search,
    context_module: contextModule,
    subject,
    query,
    action: ActionType.tappedNavigationTab,
  }),
  tappedSearchResult: (data: TappedSearchResultData) => ({
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
    context_screen: Schema.PageNames.Search,
    query: data.query,
    position: data.position,
    selected_object_type: data.type,
    selected_object_slug: data.slug,
    context_module: data.contextModule,
    action: Schema.ActionNames.SelectedResultFromSearchScreen,
  }),
}
