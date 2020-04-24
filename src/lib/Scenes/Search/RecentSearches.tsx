import { Sans, space, Spacer } from "@artsy/palette"
import AsyncStorage from "@react-native-community/async-storage"
import { useContext, useEffect, useMemo, useState } from "react"
import React from "react"
import { LayoutAnimation, ScrollView } from "react-native"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchResult } from "./SearchResult"
import { SearchResultList } from "./SearchResultList"

const maxToKeep = 100
const storageKey = "SEARCH/RECENT_SEARCHES"

export interface RecentSearch {
  type: "AUTOSUGGEST_RESULT_TAPPED"
  props: AutosuggestResult
}

const RecentSearchesContext = React.createContext<{
  searches: RecentSearch[]
  updateSearches: (updater: (searches: RecentSearch[]) => RecentSearch[]) => Promise<void>
}>(null as any /* STRICTNESS_MIGRATION */)

export const ProvideRecentSearches: React.FC = ({ children }) => {
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

  const updateSearches = useMemo(() => {
    return async (updater: (searches: RecentSearch[]) => RecentSearch[]) => {
      const value = await AsyncStorage.getItem(storageKey)
      const oldSearches = JSON.parse(value || "[]") as RecentSearch[]
      const newSearches = updater(oldSearches)
      setSearches(newSearches)
      await AsyncStorage.setItem(storageKey, JSON.stringify(newSearches))
    }
  }, [])

  return (
    <RecentSearchesContext.Provider value={{ searches: searches! /* STRICTNESS_MIGRATION */, updateSearches }}>
      {children}
    </RecentSearchesContext.Provider>
  )
}

export function useRecentSearches({ numSearches = 10 }: { numSearches?: number } = {}) {
  const { searches, updateSearches } = useContext(RecentSearchesContext)
  return {
    get recentSearches() {
      return searches ? searches.slice(0, numSearches) : []
    },
    async notifyRecentSearch(search: RecentSearch) {
      // @ts-ignore STRICTNESS_MIGRATION
      await updateSearches(oldSearches => {
        // @ts-ignore STRICTNESS_MIGRATION
        const newSearches = oldSearches.filter(s => s.props.href !== search.props.href)
        newSearches.unshift(search)
        if (newSearches.length > maxToKeep) {
          newSearches.pop()
        }
        return newSearches
      })
    },
    async deleteRecentSearch(props: RecentSearch["props"]) {
      // @ts-ignore STRICTNESS_MIGRATION
      await updateSearches(oldSearches => oldSearches.filter(s => s.props.href !== props.href))
    },
  }
}

export const RecentSearches: React.FC = () => {
  const { recentSearches, deleteRecentSearch } = useRecentSearches()
  return (
    <ScrollView style={{ padding: space(2) }} keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
      <Sans size="3" weight="medium">
        Recent
      </Sans>
      <Spacer mb={1} />
      <SearchResultList
        // @ts-ignore STRICTNESS_MIGRATION
        results={recentSearches.map(({ props: result }) => (
          <SearchResult
            result={result}
            updateRecentSearchesOnTap={false}
            displayingRecentResult
            onDelete={() => {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 230 })
              deleteRecentSearch(result)
            }}
          />
        ))}
      />
    </ScrollView>
  )
}
