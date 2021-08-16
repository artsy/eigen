import { captureMessage } from "@sentry/react-native"
import { Search2Query, Search2QueryResponse } from "__generated__/Search2Query.graphql"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { SearchInput } from "lib/Components/SearchInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { Flex, useColor } from "palette"
import React, { useState } from "react"
import { connectSearchBox, InstantSearch } from "react-instantsearch-native"
import { graphql, QueryRenderer } from "react-relay"

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

export const Search2: React.FC<Search2QueryResponse> = (props) => {
  const color = useColor()
  const [searchState, setSearchState] = useState({})

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
