import { Flex, Sans, Spacer } from "@artsy/palette"
import AsyncStorage from "@react-native-community/async-storage"
import { useEffect, useState } from "react"
import React from "react"
import { LayoutAnimation } from "react-native"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchResult } from "./SearchResult"
import { SearchResultList } from "./SearchResultList"

const maxToKeep = 100
const storageKey = "SEARCH/RECENT_SEARCHES"

export interface RecentSearch {
  type: "AUTOSUGGEST_RESULT_TAPPED"
  props: AutosuggestResult
}

export function useRecentSearches({ numSearches = 10 }: { numSearches?: number } = {}) {
  const [searches, setSearches] = useState<null | RecentSearch[]>(null)

  useEffect(() => {
    // initial load
    AsyncStorage.getItem(storageKey).then(val => {
      if (val) {
        try {
          setSearches(JSON.parse(val))
          return
          // tslint:disable-next-line:no-empty
        } catch (e) {}
      }
      setSearches([])
    })
  }, [])

  return {
    get recentSearches() {
      return searches ? searches.slice(0, numSearches) : []
    },
    async notifyRecentSearch(search: RecentSearch) {
      // don't update local state because we don't want order to change unless specifically requested via forced update
      // of consuming component
      const value = await AsyncStorage.getItem(storageKey)
      const oldSearches = JSON.parse(value || "[]") as RecentSearch[]
      const newSearches = oldSearches ? oldSearches.filter(s => s.props.href !== search.props.href) : []
      newSearches.unshift(search)
      if (newSearches.length > maxToKeep) {
        newSearches.pop()
      }
      await AsyncStorage.setItem(storageKey, JSON.stringify(newSearches))
    },
    async deleteRecentSearch(props: RecentSearch["props"]) {
      const value = await AsyncStorage.getItem(storageKey)
      const oldSearches = JSON.parse(value || "[]") as RecentSearch[]
      const newSearches = oldSearches ? oldSearches.filter(s => s.props.href !== props.href) : []
      setSearches(newSearches)
      await AsyncStorage.setItem(storageKey, JSON.stringify(newSearches))
    },
  }
}

export const RecentSearches: React.FC = () => {
  const { recentSearches, deleteRecentSearch } = useRecentSearches()
  return (
    <Flex p={2}>
      <Sans size="3" weight="medium">
        Recent
      </Sans>
      <Spacer mb={1} />
      <SearchResultList
        results={recentSearches.map(({ props: result }) => (
          <SearchResult
            result={result}
            onDelete={() => {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 230 })
              deleteRecentSearch(result)
            }}
          />
        ))}
      />
    </Flex>
  )
}
