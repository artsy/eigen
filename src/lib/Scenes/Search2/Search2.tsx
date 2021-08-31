import { captureMessage } from "@sentry/react-native"
import { Search2Query, Search2QueryResponse } from "__generated__/Search2Query.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput as SearchBox } from "lib/Components/SearchInput"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { Flex, Pill, Spacer, Text, Touchable } from "palette"
import React, { useRef, useState } from "react"
import { connectHighlight, connectInfiniteHits, connectSearchBox, InstantSearch } from "react-instantsearch-native"
import { FlatList, Platform, ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components"
import { AutosuggestResults } from "../Search/AutosuggestResults"
import { CityGuideCTA } from "../Search/CityGuideCTA"
import { RecentSearches } from "../Search/RecentSearches"
import { SearchContext, useSearchProviderValues } from "../Search/SearchContext"

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

interface ArtistSearchResult {
  objectID: string
  name_exact: string
  name: string
  alternate_names: string
  career_stage: number
  follow_count: number
  search_boost: number
  nationality: string
  visible_to_public: boolean
  fair_ids: string[]
  partner_ids: string[]
  image_url: string
  birth_year: string
  slug: string
}

const SearchResults: React.FC<{ hits: ArtistSearchResult[] }> = ({ hits }) => {
  const flatListRef = useRef<FlatList<ArtistSearchResult>>(null)
  return (
    <AboveTheFoldFlatList<ArtistSearchResult>
      listRef={flatListRef}
      initialNumToRender={isPad() ? 24 : 12}
      style={{ flex: 1, padding: 20 }}
      data={hits}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item }) => (
        <Flex mb={2}>
          <Touchable onPress={() => navigate(`/artist/${item.slug}`, { passProps: { initialTab: "Artworks" } })}>
            <Flex flexDirection="row" alignItems="center">
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
        </Flex>
      )}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    />
  )
}

const SearchInputContainer = connectSearchBox(SearchInput)
const SearchResultsContainer = connectInfiniteHits(SearchResults)

interface SearchState {
  query?: string
  page?: number
}

export const Search2: React.FC<Search2QueryResponse> = (props) => {
  const [searchState, setSearchState] = useState<SearchState>({})
  const [selectedAlgoliaIndex, setSelectedAlgoliaIndex] = useState("")
  const searchProviderValues = useSearchProviderValues(searchState?.query ?? "")
  const { system } = props

  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)

  if (!searchClient) {
    // error handling in case appID or apiKey is not set ??
    return null
  }

  const renderResults = () =>
    !!selectedAlgoliaIndex ? <SearchResultsContainer /> : <AutosuggestResults query={searchState.query!} />

  const shouldStartQuering = !!searchState?.query?.length && searchState?.query.length >= 2

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <ArtsyKeyboardAvoidingView>
        <InstantSearch
          searchClient={searchClient}
          indexName={selectedAlgoliaIndex || "Artist_staging"}
          searchState={searchState}
          onSearchStateChange={setSearchState}
        >
          <Flex p={2} pb={1}>
            <SearchInputContainer
              placeholder={!!selectedAlgoliaIndex ? "Search Artists" : "Search artists, artworks, galleries, etc"}
            />
          </Flex>

          {!!shouldStartQuering ? (
            <>
              <Flex p={2} pb={1} flexDirection="row">
                {system?.algolia?.indices.map(({ name, displayName }) => (
                  <Pill
                    key={name}
                    variant="textRound"
                    active={selectedAlgoliaIndex === name}
                    onPress={() => setSelectedAlgoliaIndex(selectedAlgoliaIndex === name ? "" : name)}
                  >
                    {displayName}
                  </Pill>
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
