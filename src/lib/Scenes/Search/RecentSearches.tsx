import { Message } from "@artsy/palette"
import { action, Action, createContextStore, persist } from "easy-peasy"
import { SectionTitle } from "lib/Components/SectionTitle"
import React from "react"
import { LayoutAnimation } from "react-native"
import { storage } from "../../utils/storage"
import { AutosuggestResult } from "./AutosuggestResults"
import { SearchResult } from "./SearchResult"
import { SearchResultList } from "./SearchResultList"

export const MAX_SAVED_RECENT_SEARCHES = 100
export const MAX_SHOWN_RECENT_SEARCHES = 5

export interface RecentSearch {
  type: "AUTOSUGGEST_RESULT_TAPPED"
  props: AutosuggestResult
}

export interface StoreModel {
  recentSearches: RecentSearch[]
  addRecentSearch: Action<StoreModel, RecentSearch>
  deleteRecentSearch: Action<StoreModel, AutosuggestResult>
}

export const recentSearchesModel: StoreModel = {
  recentSearches: [],
  addRecentSearch: action((state, payload) => {
    const newSearches = state.recentSearches.filter(
      (recentSearch: RecentSearch) => recentSearch.props.href !== payload.props.href
    )
    newSearches.unshift(payload)
    if (newSearches.length > MAX_SAVED_RECENT_SEARCHES) {
      newSearches.pop()
    }
    state.recentSearches = newSearches
  }),
  deleteRecentSearch: action((state, payload) => {
    state.recentSearches = state.recentSearches.filter(
      (recentSearch: RecentSearch) => recentSearch.props.href !== payload.href
    )
  }),
}

export const RecentSearchContext = createContextStore<StoreModel>(persist(recentSearchesModel, { storage }))

export const ProvideRecentSearches: React.FC = ({ children }) => {
  return <RecentSearchContext.Provider>{children}</RecentSearchContext.Provider>
}

// Shown Recent Searches Selector
export const getRecentSearches = (recentSearches: RecentSearch[], numSearches: number = MAX_SHOWN_RECENT_SEARCHES) => {
  return recentSearches.slice(0, numSearches)
}

export const RecentSearches: React.FC = () => {
  const recentSearches = getRecentSearches(RecentSearchContext.useStoreState(state => state.recentSearches))
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
