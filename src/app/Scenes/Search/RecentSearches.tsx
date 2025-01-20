import { SimpleMessage } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import { LayoutAnimation } from "react-native"
import { useRecentSearches } from "./SearchModel"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"
import { SearchResultList } from "./components/SearchResultList"

export const RecentSearches: React.FC = () => {
  const recentSearches = useRecentSearches()
  return (
    <>
      <SectionTitle title="Recent Searches" />

      {recentSearches.length ? (
        <SearchResultList
          results={recentSearches.map(({ props: result }) => (
            <AutosuggestSearchResult
              key={result.internalID}
              result={result}
              showResultType
              updateRecentSearchesOnTap={false}
              displayingRecentResult
              onDelete={() => {
                LayoutAnimation.configureNext({
                  ...LayoutAnimation.Presets.easeInEaseOut,
                  duration: 230,
                })
                GlobalStore.actions.search.deleteRecentSearch(result)
              }}
            />
          ))}
        />
      ) : (
        <SimpleMessage>We’ll save your recent searches here</SimpleMessage>
      )}
    </>
  )
}
