import { GlobalStore } from "app/store/GlobalStore"
import { Action, action } from "easy-peasy"
import { AutosuggestResult } from "./AutosuggestResults"

export const MAX_SAVED_RECENT_SEARCHES = 100
export const MAX_SHOWN_RECENT_SEARCHES = 5

export interface RecentSearch {
  type: "AUTOSUGGEST_RESULT_TAPPED"
  props: AutosuggestResult
}

export interface SearchModel {
  recentSearches: RecentSearch[]
  addRecentSearch: Action<SearchModel, RecentSearch>
  deleteRecentSearch: Action<SearchModel, AutosuggestResult>
  clearRecentSearches: Action<SearchModel>
}

export const getSearchModel = (): SearchModel => ({
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
  clearRecentSearches: action((state) => {
    state.recentSearches = []
  }),
})

export const useRecentSearches = (numSearches: number = MAX_SHOWN_RECENT_SEARCHES) => {
  return GlobalStore.useAppState((state) => {
    return state.search.recentSearches
  }).slice(0, numSearches)
}
