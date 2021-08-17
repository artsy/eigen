import { captureMessage } from "@sentry/react-native"
import { Search2Query, Search2QueryResponse } from "__generated__/Search2Query.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput as SearchBox } from "lib/Components/SearchInput"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isPad } from "lib/utils/hardware"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { Flex, Spacer, Text, Touchable, useColor } from "palette"
import React, { useRef, useState } from "react"
import { connectHighlight, connectInfiniteHits, connectSearchBox, InstantSearch } from "react-instantsearch-native"
import { FlatList, Platform, ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import styled from "styled-components"
import { CityGuideCTA } from "../Search/CityGuideCTA"

interface SearchInputProps {
  refine: (value: string) => any
}

const SearchInput: React.FC<SearchInputProps> = ({ refine }) => {
  return (
    <SearchBox
      placeholder="Search artists"
      onChangeText={(queryText) => {
        refine(queryText)
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

interface Artist {
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

const SearchResults: React.FC<{ hits: Artist[] }> = ({ hits }) => {
  const flatListRef = useRef<FlatList<Artist>>(null)
  return (
    <AboveTheFoldFlatList<Artist>
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
  const color = useColor()
  const [searchState, setSearchState] = useState<SearchState>({})

  const { system } = props

  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)

  if (!searchClient) {
    // error handling in case appID or apiKey is not set ??
    return null
  }

  return (
    <ArtsyKeyboardAvoidingView>
      <InstantSearch
        searchClient={searchClient}
        indexName="POC_Artists"
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <Flex p={2} pb={1} style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
          <SearchInputContainer />
        </Flex>
        {!!searchState?.query?.length && searchState?.query?.length >= 2 ? (
          <SearchResultsContainer />
        ) : (
          <Scrollable>
            <Spacer mb={3} />
            {!isPad() && Platform.OS === "ios" ? <CityGuideCTA /> : null}
            <Spacer mb="40px" />
          </Scrollable>
        )}
      </InstantSearch>
    </ArtsyKeyboardAvoidingView>
  )
}

export const Search2QueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<Search2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Search2Query {
          system {
            algolia {
              appID
              apiKey
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
