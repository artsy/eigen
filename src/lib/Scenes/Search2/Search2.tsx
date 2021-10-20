import { ContextModule, OwnerType } from "@artsy/cohesion"
import { useNavigation } from "@react-navigation/native"
import { captureMessage } from "@sentry/react-native"
import { Search2_system } from "__generated__/Search2_system.graphql"
import { Search2Query } from "__generated__/Search2Query.graphql"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { SearchInput as SearchBox } from "lib/Components/SearchInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isPad } from "lib/utils/hardware"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Schema } from "lib/utils/track"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { useSearchInsightsConfig } from "lib/utils/useSearchInsightsConfig"
import { throttle } from "lodash"
import { Box, Flex, Spacer } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
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
import { AutosuggestResult, AutosuggestResults } from "../Search/AutosuggestResults"
import { CityGuideCTA } from "../Search/CityGuideCTA"
import { RecentSearches } from "../Search/RecentSearches"
import { SearchContext, useSearchProviderValues } from "../Search/SearchContext"
import { SearchPills } from "./components/SearchPills"
import { SearchPlaceholder } from "./components/SearchPlaceholder"
import { RefetchWhenApiKeyExpiredContainer } from "./containers/RefetchWhenApiKeyExpired"
import { SearchArtworksQueryRenderer } from "./containers/SearchArtworksContainer"
import { getContextModuleByPillName } from "./helpers"
import { SearchResults } from "./SearchResults"
import { AlgoliaSearchResult, PillType } from "./types"

interface SearchInputProps {
  placeholder: string
  currentRefinement: string
  refine: (value: string) => any
  onReset: () => void
}

interface TappedSearchResultData {
  query: string
  type: string
  position: number
  contextModule: ContextModule
  slug: string
  objectTab?: string
}

const SEARCH_THROTTLE_INTERVAL = 500

const SearchInput: React.FC<SearchInputProps> = ({ currentRefinement, placeholder, refine, onReset }) => {
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(currentRefinement)
  const isAndroid = Platform.OS === "android"
  const navigation = isAndroid ? useNavigation() : null
  const handleChangeText = useMemo(() => throttle(refine, SEARCH_THROTTLE_INTERVAL), [])

  const handleReset = () => {
    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
    })

    refine("")
    handleChangeText.cancel()
    onReset()
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
    <SearchBox
      ref={searchProviderValues.inputRef}
      enableCancelButton
      placeholder={placeholder}
      onChangeText={(text) => {
        if (text.length === 0) {
          handleReset()
          return
        }

        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
          query: text,
        })

        handleChangeText(text)
        onReset()
      }}
      onClear={handleReset}
      onCancelPress={handleReset}
    />
  )
}

const SearchInputContainer = connectSearchBox(SearchInput)
const SearchResultsContainerWithState = connectStateResults(SearchResults)
const SearchResultsContainer = connectInfiniteHits(SearchResultsContainerWithState)

interface SearchState {
  query?: string
  page?: number
}

const TOP_PILL: PillType = {
  name: "TOP",
  displayName: "Top",
  type: "elastic",
}
const ARTWORKS_PILL: PillType = {
  name: "ARTWORK",
  displayName: "Artworks",
  type: "elastic",
}
const pills: PillType[] = [TOP_PILL, ARTWORKS_PILL]

const objectTabByContextModule: Partial<Record<ContextModule, string>> = {
  [ContextModule.auctionTab]: "Auction Results",
  [ContextModule.artistsTab]: "Artworks",
}

interface Search2Props {
  relay: RelayRefetchProp
  system: Search2_system | null
}

export const Search2: React.FC<Search2Props> = (props) => {
  const { system, relay } = props
  const searchPillsRef = useRef<ScrollView>(null)
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchProviderValues = useSearchProviderValues(searchState?.query ?? "")
  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)
  const searchInsightsConfigured = useSearchInsightsConfig(system?.algolia?.appID, system?.algolia?.apiKey)
  const { trackEvent } = useTracking()

  const pillsArray = useMemo<PillType[]>(() => {
    const indices = system?.algolia?.indices

    if (Array.isArray(indices) && indices.length > 0) {
      const formattedIndices: PillType[] = indices.map((indice) => ({
        ...indice,
        type: "algolia",
      }))

      return [...pills, ...formattedIndices]
    }

    return pills
  }, [system?.algolia?.indices])

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
          indexName={selectedPill.name}
          categoryDisplayName={selectedPill.displayName}
          onRetry={handleRetry}
          trackResultPress={handleTrackAlgoliaResultPress}
        />
      )
    }
    if (selectedPill.name === TOP_PILL.name) {
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
    return selectedPill.name === pill.name
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
      position: result.__position,
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
          indexName={selectedPill.type === "algolia" ? selectedPill.name : ""}
          searchState={searchState}
          onSearchStateChange={setSearchState}
        >
          <Configure clickAnalytics />
          <RefetchWhenApiKeyExpiredContainer relay={relay} />
          <Flex p={2} pb={1}>
            <SearchInputContainer
              placeholder="Search artists, artworks, galleries, etc"
              onReset={handleResetSearchInput}
            />
          </Flex>
          <Flex flex={1} collapsable={false}>
            {!!shouldStartQuering ? (
              <>
                <Box pt={2} pb={1}>
                  <SearchPills
                    ref={searchPillsRef}
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

const Search2RefetchContainer = createRefetchContainer(
  Search2,
  {
    system: graphql`
      fragment Search2_system on System {
        __typename
        algolia {
          appID
          apiKey
          indices {
            name
            displayName
          }
        }
      }
    `,
  },
  graphql`
    query Search2RefetchQuery {
      system {
        ...Search2_system
      }
    }
  `
)

export const Search2QueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<Search2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Search2Query {
          system {
            ...Search2_system
          }
        }
      `}
      render={({ props, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        return <Search2RefetchContainer system={props?.system ?? null} />
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
  }),
  tappedSearchResult: (data: TappedSearchResultData) => ({
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
    context_screen: Schema.PageNames.Search,
    query: data.query,
    position: data.position,
    selected_object_type: data.type,
    selected_object_slug: data.slug,
    selected_object_tab: data.objectTab,
    context_module: data.contextModule,
  }),
}
