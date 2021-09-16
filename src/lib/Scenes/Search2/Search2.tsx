import { captureMessage } from "@sentry/react-native"
import { Search2_system } from "__generated__/Search2_system.graphql"
import { Search2Query } from "__generated__/Search2Query.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput as SearchBox } from "lib/Components/SearchInput"
import { navigate, navigateToPartner } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isPad } from "lib/utils/hardware"
import { ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Schema } from "lib/utils/track"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { searchInsights, useSearchInsightsConfig } from "lib/utils/useSearchInsightsConfig"
import { Box, Flex, Pill, Spacer, Spinner, Text, Touchable, useSpace } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { InfiniteHitsProvided, StateResultsProvided } from "react-instantsearch-core"
import {
  Configure,
  connectHighlight,
  connectInfiniteHits,
  connectSearchBox,
  connectStateResults,
  InstantSearch,
} from "react-instantsearch-native"
import { FlatList, Platform, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components"
import { AutosuggestResults } from "../Search/AutosuggestResults"
import { CityGuideCTA } from "../Search/CityGuideCTA"
import { RecentSearches } from "../Search/RecentSearches"
import { SearchContext, useSearchProviderValues } from "../Search/SearchContext"
import { SearchPlaceholder } from "./components/SearchPlaceholder"
import { RefetchWhenApiKeyExpiredContainer } from "./containers/RefetchWhenApiKeyExpired"
import { SearchArtworksGridQueryRenderer } from "./SearchArtworksGrid"
import { AlgoliaSearchResult } from "./types"

interface SearchInputProps {
  placeholder: string
  currentRefinement: string
  refine: (value: string) => any
}

const SearchInput: React.FC<SearchInputProps> = ({ currentRefinement, placeholder, refine }) => {
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(currentRefinement)

  return (
    <SearchBox
      ref={searchProviderValues.inputRef}
      enableCancelButton
      placeholder={placeholder}
      onChangeText={(queryText) => {
        refine(queryText)
        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
          query: queryText,
        })
      }}
      onFocus={() => {
        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
          currentRefinement,
        })
      }}
      onClear={() => {
        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
        })
      }}
    />
  )
}

const Highlight = connectHighlight(({ highlight, attribute, hit, highlightProperty = "_highlightResult" }) => {
  const parsedHit = highlight({ attribute, hit, highlightProperty })

  return (
    <Text>
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

interface SearchResultsProps
  extends StateResultsProvided<AlgoliaSearchResult>,
    InfiniteHitsProvided<AlgoliaSearchResult> {
  indexName: string
  categoryDisplayName: string
}

const SearchResults: React.FC<SearchResultsProps> = ({
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
            <Flex>
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

const SearchInputContainer = connectSearchBox(SearchInput)
const SearchResultsContainerWithState = connectStateResults(SearchResults)
const SearchResultsContainer = connectInfiniteHits(SearchResultsContainerWithState)

interface SearchState {
  query?: string
  page?: number
}

interface PillType {
  name: string
  displayName: string
}

const pills: PillType[] = [{ name: "ARTWORK", displayName: "Artworks" }]

interface Search2Props {
  relay: RelayRefetchProp
  system: Search2_system | null
}

export const Search2: React.FC<Search2Props> = (props) => {
  const { system, relay } = props
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedAlgoliaIndex, setSelectedAlgoliaIndex] = useState("")
  const [elasticSearchEntity, setElasticSearchEntity] = useState("")
  const searchProviderValues = useSearchProviderValues(searchState?.query ?? "")
  const [activePillDisplayName, setActivePillDisplayName] = useState("")
  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)
  const searchInsightsConfigured = useSearchInsightsConfig(system?.algolia?.appID, system?.algolia?.apiKey)

  const pillsArray = useMemo<PillType[]>(() => {
    const indices = system?.algolia?.indices

    if (Array.isArray(indices) && indices.length > 0) {
      return [...pills, ...indices]
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

  const renderResults = (categoryDisplayName: string) => {
    if (!!selectedAlgoliaIndex) {
      return <SearchResultsContainer indexName={selectedAlgoliaIndex} categoryDisplayName={categoryDisplayName} />
    }
    if (!!elasticSearchEntity) {
      return <SearchArtworksGridQueryRenderer keyword={searchState.query!} />
    }
    return <AutosuggestResults query={searchState.query!} />
  }

  const shouldStartQuering = !!searchState?.query?.length && searchState?.query.length >= 2

  const handlePillPress = ({ name, displayName }: PillType) => {
    setActivePillDisplayName(displayName)
    setSearchState((prevState) => ({ ...prevState, page: 1 }))
    if (name === "ARTWORK") {
      setSelectedAlgoliaIndex("")
      setElasticSearchEntity(elasticSearchEntity === name ? "" : name)
      return
    }
    setElasticSearchEntity("")
    setSelectedAlgoliaIndex(selectedAlgoliaIndex === name ? "" : name)
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <ArtsyKeyboardAvoidingView>
        <InstantSearch
          searchClient={searchClient}
          indexName={selectedAlgoliaIndex}
          searchState={searchState}
          onSearchStateChange={setSearchState}
        >
          <Configure clickAnalytics />
          <RefetchWhenApiKeyExpiredContainer relay={relay} />
          <Flex p={2} pb={1}>
            <SearchInputContainer placeholder="Search artists, artworks, galleries, etc" />
          </Flex>
          {!!shouldStartQuering ? (
            <>
              <Flex p={2} pb={1}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {pillsArray.map((pill) => {
                    const { name, displayName } = pill
                    return (
                      <Pill
                        mr={1}
                        key={name}
                        rounded
                        selected={selectedAlgoliaIndex === name || elasticSearchEntity === name}
                        onPress={() => handlePillPress(pill)}
                      >
                        {displayName}
                      </Pill>
                    )
                  })}
                </ScrollView>
              </Flex>
              {renderResults(activePillDisplayName)}
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
