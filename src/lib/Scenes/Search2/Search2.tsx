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
import React, { useMemo, useState } from "react"
import {
  Configure,
  connectInfiniteHits,
  connectSearchBox,
  connectStateResults,
  InstantSearch,
} from "react-instantsearch-native"
import { Platform, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components"
import { AutosuggestResults } from "../Search/AutosuggestResults"
import { CityGuideCTA } from "../Search/CityGuideCTA"
import { RecentSearches } from "../Search/RecentSearches"
import { SearchContext, useSearchProviderValues } from "../Search/SearchContext"
import { SearchPills } from "./components/SearchPills"
import { SearchPlaceholder } from "./components/SearchPlaceholder"
import { RefetchWhenApiKeyExpiredContainer } from "./containers/RefetchWhenApiKeyExpired"
import { SearchArtworksQueryRenderer } from "./containers/SearchArtworksContainer"
import { SearchResults } from "./SearchResults"
import { PillType } from "./types"

interface SearchInputProps {
  placeholder: string
  currentRefinement: string
  refine: (value: string) => any
  onSubmitEditing: () => void
  onReset: () => void
}

const SEARCH_THROTTLE_INTERVAL = 500

const SearchInput: React.FC<SearchInputProps> = ({
  currentRefinement,
  placeholder,
  refine,
  onSubmitEditing,
  onReset,
}) => {
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(currentRefinement)

  const handleChangeText = useMemo(() => throttle(refine, SEARCH_THROTTLE_INTERVAL), [])

  const handleReset = () => {
    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
    })

    refine("")
    handleChangeText.cancel()
    onReset()
  }

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
      onSubmitEditing={onSubmitEditing}
      onFocus={() => {
        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
          currentRefinement,
        })
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

interface Search2Props {
  relay: RelayRefetchProp
  system: Search2_system | null
}

export const Search2: React.FC<Search2Props> = (props) => {
  const { system, relay } = props
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchProviderValues = useSearchProviderValues(searchState?.query ?? "")
  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)
  const searchInsightsConfigured = useSearchInsightsConfig(system?.algolia?.appID, system?.algolia?.apiKey)

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

  const renderResults = () => {
    if (selectedPill.type === "algolia") {
      return <SearchResultsContainer indexName={selectedPill.name} categoryDisplayName={selectedPill.displayName} />
    }
    if (selectedPill.name === TOP_PILL.name) {
      return <AutosuggestResults query={searchState.query!} showResultType showQuickNavigationButtons />
    }
    return <SearchArtworksQueryRenderer keyword={searchState.query!} />
  }

  const shouldStartQuering = !!searchState?.query?.length && searchState?.query.length >= 2

  const handlePillPress = (pill: PillType) => {
    setSearchState((prevState) => ({ ...prevState, page: 1 }))
    setSelectedPill(pill)
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.name === pill.name
  }

  const handleSubmitEditing = () => {
    if (shouldStartQuering) {
      setSelectedPill(TOP_PILL)
    }
  }

  const handleResetSearchInput = () => {
    setSelectedPill(TOP_PILL)
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
              onSubmitEditing={handleSubmitEditing}
              onReset={handleResetSearchInput}
            />
          </Flex>
          {!!shouldStartQuering ? (
            <>
              <Box pt={2} pb={1}>
                <SearchPills pills={pillsArray} onPillPress={handlePillPress} isSelected={isSelected} />
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
