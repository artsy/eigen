import { Action, action } from "easy-peasy"
// import { GlobalStore } from "lib/store/GlobalStore"
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
}

export const SearchModel: SearchModel = {
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

export const useRecentSearches = (_numSearches: number = MAX_SHOWN_RECENT_SEARCHES) => {
  // return GlobalStore.useAppState((state) => state.search.recentSearches).slice(0, numSearches)
  return [] as RecentSearch[]
}
