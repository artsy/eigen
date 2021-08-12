// @ts-nocheck
import algoliasearch from "algoliasearch"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput } from "lib/Components/SearchInput"

import _ from "lodash"
import { Button, ButtonV2, Flex, Spacer, Text } from "palette"
import React from "react"
import { useState } from "react"
import { connect, connectInfiniteHits, connectSearchBox, Index, InstantSearch } from "react-instantsearch-native"
import { View } from "react-native"
import { FlatList, ScrollView } from "react-native"
import { SearchResult } from "../Search/SearchResult"
import { SearchResultList } from "../Search/SearchResultList"
interface AlgoliaScreenProps {
  text: string
}
// Replace with algolia key/appid
const ALGOLIA_APP_ID = ""
const ALGOLIA_API_KEY = ""

const appId = ALGOLIA_APP_ID
const apiKey = ALGOLIA_API_KEY

const SearchBox = ({ currentRefinement, refine }) => {
  return <SearchInput onChangeText={(value) => refine(value)} value={currentRefinement} />
}

const InfiniteHits = ({ hits, hasMore, refine }) => {
  return (
    <FlatList
      style={{ height: 200, width: "100%" }}
      data={hits}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <Spacer mb={2} />}
      renderItem={({ item }) => {
        return (
          <Flex flexDirection="row" alignItems="center">
            {!!item?.image_url && (
              <OpaqueImageView
                imageURL={item.image_url}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              />
            )}
            <Spacer ml={1} />
            <Text>{item.name}</Text>
          </Flex>
        )
      }}
    />
  )
}

const EnhancedInfiniteHits = connectInfiniteHits(InfiniteHits)

const EnhancedSearchBox = connectSearchBox(SearchBox)

export const AlgoliaScreen: React.FC<AlgoliaScreenProps> = ({ text = "test" }) => {
  const [searchState, setSearchState] = useState({})
  const [searchIndex, setSearchIndex] = useState("POC_Artworks")
  const searchIndexes = [
    "POC_Artworks",
    "POC_Artists",
    "POC_Artist_Series",
    "POC_Articles",
    "POC_Marketing_Collections",
  ]
  return (
    <Flex alignItems="center">
      <Spacer mb={6} />
      <Text>Hello, I am the algolia screen 👋</Text>
      <InstantSearch
        searchClient={searchClient}
        indexName="POC_Artworks"
        searchState={searchState}
        onSearchStateChange={setSearchState}
      >
        <EnhancedSearchBox />
        <ScrollView style={{ height: 60, width: "100%" }} horizontal>
          {searchIndexes.map((si) => (
            <>
              <Button
                size="small"
                variant={si === searchIndex ? "primaryBlack" : "secondaryOutline"}
                style={{ padding: 2 }}
                onPress={() => setSearchIndex(si)}
              >
                <Text>{si}</Text>
              </Button>
              <Spacer ml={1} />
            </>
          ))}
        </ScrollView>

        <Index indexName={searchIndex}>
          <EnhancedInfiniteHits />
        </Index>
        <Index indexName={"POC_Artists"}>
          <EnhancedInfiniteHits />
        </Index>
      </InstantSearch>
    </Flex>
  )
}
