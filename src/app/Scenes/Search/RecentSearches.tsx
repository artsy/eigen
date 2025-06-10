import { SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import Animated, { LinearTransition } from "react-native-reanimated"
import { useRecentSearches } from "./SearchModel"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"

export const RecentSearches: React.FC = () => {
  const recentSearches = useRecentSearches()

  return (
    <>
      <SectionTitle title="Recent Searches" />

      {recentSearches.length ? (
        <Animated.FlatList
          data={recentSearches}
          ItemSeparatorComponent={() => <Spacer y={2} />}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          itemLayoutAnimation={LinearTransition}
          keyExtractor={(item, index) => item.props.internalID ?? index.toString()}
          renderItem={({ item }) => (
            <AutosuggestSearchResult
              key={item.props.internalID}
              result={item.props}
              showResultType
              updateRecentSearchesOnTap={false}
              displayingRecentResult
              onDelete={() => {
                GlobalStore.actions.search.deleteRecentSearch(item.props)
              }}
            />
          )}
        />
      ) : (
        <SimpleMessage>We’ll save your recent searches here</SimpleMessage>
      )}
    </>
  )
}
