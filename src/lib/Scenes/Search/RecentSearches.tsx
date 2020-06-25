import { Message } from "@artsy/palette"
import AsyncStorage from "@react-native-community/async-storage"
import { action, Action, createContextStore, persist } from "easy-peasy"
import { SectionTitle } from "lib/Components/SectionTitle"
import React from "react"
import { LayoutAnimation } from "react-native"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchResult } from "./SearchResult"
import { SearchResultList } from "./SearchResultList"

const maxToKeep = 100

export interface RecentSearch {
  type: "AUTOSUGGEST_RESULT_TAPPED"
  props: AutosuggestResult
}

interface Store {
  searches: RecentSearch[]
  addRecentSearch: Action<Store, RecentSearch>
  deleteRecentSearch: Action<Store, AutosuggestResult>
}

const storage = {
  async getItem(key: string) {
    return JSON.parse((await AsyncStorage.getItem(key))!)
  },
  async setItem(key: string, data: any) {
    AsyncStorage.setItem(key, JSON.stringify(data))
  },
  async removeItem(key: string) {
    AsyncStorage.removeItem(key)
  },
}

export const RecentSearchContext = createContextStore<Store>(
  persist(
    {
      searches: [],
      addRecentSearch: action((state, payload) => {
        const newSearches = state.searches.filter(s => s.props.href !== payload.props.href)
        newSearches.unshift(payload)
        if (newSearches.length > maxToKeep) {
          newSearches.pop()
        }
        state.searches = newSearches
      }),
      deleteRecentSearch: action((state, payload) => {
        state.searches = state.searches.filter(s => s.props.href !== payload.href)
      }),
    },
    { storage }
  )
)

export const ProvideRecentSearches: React.FC = ({ children }) => {
  return <RecentSearchContext.Provider>{children}</RecentSearchContext.Provider>
}

export const RecentSearches: React.FC = () => {
  const recentSearches = RecentSearchContext.useStoreState(state => state.searches)
  const deleteRecentSearch = RecentSearchContext.useStoreActions(actions => actions.deleteRecentSearch)
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
        <Message>We&rsquo;ll save your recent searches here</Message>
      )}
    </>
  )
}
