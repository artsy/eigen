import { SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import { useState } from "react"
import { Platform } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { useRecentSearches } from "./SearchModel"
import { AutosuggestSearchResult } from "./components/AutosuggestSearchResult"

const IS_ANDROID = Platform.OS === "android"

export const RecentSearches: React.FC = () => {
  // TODO: remove this when this reanimated issue gets fixed
  // https://github.com/software-mansion/react-native-reanimated/issues/5728
  const [flatlistHeight, setFlatlistHeight] = useState<number>()
  const recentSearches = useRecentSearches()

  return (
    <>
      <SectionTitle title="Recent Searches" />

      {recentSearches.length ? (
        <Animated.FlatList
          onLayout={(event) => {
            if (IS_ANDROID) {
              setFlatlistHeight(event.nativeEvent.layout.height)
            }
          }}
          style={IS_ANDROID ? { height: flatlistHeight } : {}}
          contentContainerStyle={IS_ANDROID ? { flex: 1, height: flatlistHeight } : {}}
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
