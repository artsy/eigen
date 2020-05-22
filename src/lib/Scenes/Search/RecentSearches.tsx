import { Message } from "@artsy/palette"
import AsyncStorage from "@react-native-community/async-storage"
import { SectionTitle } from "lib/Components/SectionTitle"
import { useContext, useEffect, useMemo, useState } from "react"
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

const RecentSearchesContext = React.createContext<{
  searches: RecentSearch[]
  updateSearches: (updater: (searches: RecentSearch[]) => RecentSearch[]) => Promise<void>
}>(null as any)

export const ProvideRecentSearches: React.FC = ({ children }) => {
  const [searches, setSearches] = useState<RecentSearch[]>([])

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
    <RecentSearchesContext.Provider value={{ searches, updateSearches }}>{children}</RecentSearchesContext.Provider>
  )
}

export function useRecentSearches({ numSearches = 10 }: { numSearches?: number } = {}) {
  const { searches, updateSearches } = useContext(RecentSearchesContext)
  return {
    get recentSearches() {
      return searches ? searches.slice(0, numSearches) : []
    },
    async notifyRecentSearch(search: RecentSearch) {
      await updateSearches(oldSearches => {
        const newSearches = oldSearches.filter(s => s.props.href !== search.props.href)
        newSearches.unshift(search)
        if (newSearches.length > maxToKeep) {
          newSearches.pop()
        }
        return newSearches
      })
    },
    async deleteRecentSearch(props: RecentSearch["props"]) {
      await updateSearches(oldSearches => oldSearches.filter(s => s.props.href !== props.href))
    },
  }
}

export const RecentSearches: React.FC = () => {
  const { recentSearches, deleteRecentSearch } = useRecentSearches()
  return (
    <>
      <SectionTitle title="Recent Searches" />
      {recentSearches.length ? (
        <SearchResultList
          results={recentSearches.slice(0, 5).map(({ props: result }) => (
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
      ) : (
        <Message>We'll save your recent searches here.</Message>
      )}
    </>
  )
}
