import { SectionTitle } from "lib/Components/SectionTitle"
import { GlobalStore } from "lib/store/GlobalStore"
import { Message } from "palette"
import React from "react"
import { LayoutAnimation } from "react-native"
import { MAX_SHOWN_RECENT_SEARCHES, useRecentSearches } from "./SearchModel"
import { SearchResult } from "./SearchResult"
import { SearchResultList } from "./SearchResultList"

export const RecentSearches: React.FC = () => {
  const recentSearches = useRecentSearches(MAX_SHOWN_RECENT_SEARCHES)
  return (
    <>
      <SectionTitle title="Recent searches" />
      {recentSearches.length ? (
        <SearchResultList
          results={recentSearches.map(({ props: result }) => (
            <SearchResult
              result={result}
              updateRecentSearchesOnTap={false}
              displayingRecentResult
              onDelete={() => {
                LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 230 })
                GlobalStore.actions.search.deleteRecentSearch(result)
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
