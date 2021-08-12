// @ts-nocheck
import algoliasearch from "algoliasearch"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput } from "lib/Components/SearchInput"
import _ from "lodash"
import { Button, FilterIcon, Flex, Spacer, Text, TouchableHighlightColor } from "palette"
import React from "react"
import { useState } from "react"
import {
  connectHighlight,
  connectInfiniteHits,
  connectRefinementList,
  connectSearchBox,
  Index,
  InstantSearch,
} from "react-instantsearch-native"
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"

// Replace with algolia key/appid
const ALGOLIA_APP_ID = ""
const ALGOLIA_API_KEY = ""

const appId = ALGOLIA_APP_ID
const apiKey = ALGOLIA_API_KEY

const searchClient = algoliasearch(appId, apiKey)

interface SearchBoxProps {
  currentRefinement: string
  refine: (value: string) => any
}

const SearchBox: React.FC<SearchBoxProps> = ({ currentRefinement, refine }) => {
  return <SearchInput onChangeText={(value) => refine(value)} value={currentRefinement} />
}

const RefinementList = ({ items, refine }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Filter</Text>
      </View>
      <View style={styles.list}>
        {items.map((item) => {
          return (
            <TouchableOpacity key={item.value} onPress={() => refine(item.value)} style={styles.item}>
              <Text>{item.label}</Text>
              <View style={styles.itemCount}>
                <Text style={styles.itemCountText}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  )
}

const EnhancedRefinementList = connectRefinementList(RefinementList)

const InfiniteHits = ({ hits, hasMore, refine }) => {
  return (
    <FlatList
      style={{ width: "100%" }}
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
            <Highlight attribute="name" hit={item} highlightProperty="_highlightResult" />
          </Flex>
        )
      }}
    />
  )
}

const EnhancedInfiniteHits = connectInfiniteHits(InfiniteHits)

const EnhancedSearchBox = connectSearchBox(SearchBox)

export const AlgoliaScreen: React.FC = () => {
  const [searchState, setSearchState] = useState({})
  const [searchIndex, setSearchIndex] = useState("POC_Artworks")
  const [isFilterArtworkModalVisible, setFilterArtworkModalVisible] = useState(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)
  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const searchIndexes = ["POC_Artworks", "POC_Artists", "POC_Artist_Series", "POC_Articles", "POC_Events"]

  const openFilterArtworksModal = () => {
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    handleCloseFilterArtworksModal()
  }
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
        <TouchableHighlightColor
          haptic
          onPress={openFilterArtworksModal}
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <FilterIcon fill={color} width="20px" height="20px" />
              <Text variant="small" color={color} ml={0.5}>
                Sort & Filter
              </Text>
            </Flex>
          )}
        />
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
        <FancyModal
          maxHeight={250}
          visible={isFilterArtworkModalVisible}
          onBackgroundPressed={closeFilterArtworksModal}
        >
          <EnhancedRefinementList attribute="medium_type" />
        </FancyModal>
      </InstantSearch>
    </Flex>
  )
}

const Highlight = connectHighlight(({ highlight, attribute, hit, highlightProperty }) => {
  const parsedHit = highlight({ attribute, hit, highlightProperty })
  const highligtedHit = parsedHit.map((part, idx) => {
    if (part.isHighlighted) {
      return (
        <Text key={idx} style={{ backgroundColor: "#ffff99" }}>
          {part.value}
        </Text>
      )
    }

    return part.value
  })

  return <Text>{highligtedHit}</Text>
})

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  title: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
  },
  list: {
    marginTop: 20,
  },
  item: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  itemCount: {
    backgroundColor: "#252b33",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 7.5,
  },
  itemCountText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
})
