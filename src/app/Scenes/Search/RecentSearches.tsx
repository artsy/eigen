import { Box, SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import { FlatList } from "react-native"
import { useRecentSearches } from "./SearchModel"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"

export const RecentSearches: React.FC = () => {
  const recentSearches = useRecentSearches()

  return (
    <>
      <SectionTitle title="Recent Searches" />

      {recentSearches.length ? (
        <FlatList
          data={recentSearches}
          ItemSeparatorComponent={() => <Spacer y={2} />}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
          ListFooterComponent={() => (
            <Box my={1}>
              <Spacer y={6} />
            </Box>
          )}
        />
      ) : (
        <SimpleMessage>We’ll save your recent searches here</SimpleMessage>
      )}
    </>
  )
}
