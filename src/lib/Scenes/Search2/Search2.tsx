import { captureMessage } from "@sentry/react-native"
import { Search2Query, Search2QueryResponse } from "__generated__/Search2Query.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput as SearchBox } from "lib/Components/SearchInput"
import { navigate, navigateToPartner } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { Flex, Pill, Spacer, Spinner, Text, Touchable, useSpace } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { InfiniteHitsProvided, StateResultsProvided } from "react-instantsearch-core"
import {
  connectHighlight,
  connectInfiniteHits,
  connectSearchBox,
  connectStateResults,
  InstantSearch,
} from "react-instantsearch-native"
import { FlatList, Platform, ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components"
import { AutosuggestResults } from "../Search/AutosuggestResults"
import { CityGuideCTA } from "../Search/CityGuideCTA"
import { RecentSearches } from "../Search/RecentSearches"
import { SearchContext, useSearchProviderValues } from "../Search/SearchContext"
import { SearchArtworksGridQueryRenderer } from "./SearchArtworksGrid"

interface SearchInputProps {
  refine: (value: string) => any
  placeholder: string
  currentRefinement: string
}

const SearchInput: React.FC<SearchInputProps> = ({ currentRefinement, refine, placeholder }) => {
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

interface AlgoliaSearchResult {
  href: string
  image_url: string
  name: string
  objectID: string
  slug: string
}

interface SearchResultsProps
  extends StateResultsProvided<AlgoliaSearchResult>,
    InfiniteHitsProvided<AlgoliaSearchResult> {
  indexName: string
}

const SearchResults: React.FC<SearchResultsProps> = ({
  hits,
  hasMore,
  searching,
  isSearchStalled,
  searchState,
  indexName,
  refineNext,
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
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      refineNext()
    }
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

const pills = [{ name: "ARTWORK", displayName: "Artworks" }]

export const Search2: React.FC<Search2QueryResponse> = (props) => {
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedAlgoliaIndex, setSelectedAlgoliaIndex] = useState("")
  const [elasticSearchEntity, setElasticSearchEntity] = useState("")
  const searchProviderValues = useSearchProviderValues(searchState?.query ?? "")
  const { system } = props
  const [pillsArray, setPillsArray] = useState(pills)
  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)

  useEffect(() => {
    if (system?.algolia?.indices !== undefined && system?.algolia?.indices.length > 0) {
      setPillsArray([...pills, ...system.algolia.indices!])
    }
  }, [system?.algolia?.indices])

  if (!searchClient) {
    // error handling in case appID or apiKey is not set ??
    return null
  }

  const renderResults = () => {
    if (!!selectedAlgoliaIndex) {
      return <SearchResultsContainer />
    }
    if (!!elasticSearchEntity) {
      return <SearchArtworksGridQueryRenderer />
    }
    return <AutosuggestResults query={searchState.query!} />
  }

  const shouldStartQuering = !!searchState?.query?.length && searchState?.query.length >= 2

  const handlePillPress = (name: string) => {
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
          <Flex p={2} pb={1}>
            <SearchInputContainer placeholder="Search artists, artworks, galleries, etc" />
          </Flex>
          {!!shouldStartQuering ? (
            <>
              <Flex p={2} pb={1} flexDirection="row">
                {pillsArray.map(({ name, displayName }) => (
                  <>
                    <Pill
                      mr={0.5}
                      key={name}
                      rounded
                      selected={selectedAlgoliaIndex === name || elasticSearchEntity === name}
                      onPress={() => handlePillPress(name)}
                    >
                      {displayName}
                    </Pill>
                  </>
                ))}
              </Flex>
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

export const Search2QueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<Search2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Search2Query {
          system {
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

        return <Search2 system={props?.system ?? null} />
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
