import { captureMessage } from "@sentry/react-native"
import { Search2Query, Search2QueryResponse } from "__generated__/Search2Query.graphql"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { SearchInput } from "lib/Components/SearchInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isPad } from "lib/utils/hardware"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { Flex, Spacer, useColor } from "palette"
import React, { useState } from "react"
import { connectSearchBox, InstantSearch } from "react-instantsearch-native"
import { Platform, ScrollView } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import styled from "styled-components"
import { CityGuideCTA } from "../Search/CityGuideCTA"
import { RecentSearches } from "../Search/RecentSearches"

interface ImprovedSearchInputProps {
  refine: (value: string) => any
}

const ImprovedSearchInput: React.FC<ImprovedSearchInputProps> = ({ refine }) => {
  return (
    <SearchInput
      placeholder="Search artists"
      onChangeText={(queryText) => {
        refine(queryText)
      }}
    />
  )
}

const ImprovedSearchInputContainer = connectSearchBox(ImprovedSearchInput)

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
          <ImprovedSearchInputContainer />
        </Flex>
        {!!searchState?.query?.length && searchState?.query?.length >= 2 ? null : (
          <Scrollable>
            <RecentSearches />
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
