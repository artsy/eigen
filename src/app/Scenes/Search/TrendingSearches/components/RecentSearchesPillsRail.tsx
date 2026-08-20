import { CloseIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { useRecentSearches } from "app/Scenes/Search/SearchModel"
import { TrendingSectionHeader } from "app/Scenes/Search/TrendingSearches/components/TrendingSectionHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Schema } from "app/utils/track"
import { useContext } from "react"
import { FlatList } from "react-native"
import { useTracking } from "react-tracking"

const AVATAR_SIZE = 26
const PILL_MAX_WIDTH = 220

export const RecentSearchesPillsRail: React.FC = () => {
  const space = useSpace()
  const recentSearches = useRecentSearches()

  if (!recentSearches.length) {
    return null
  }

  return (
    <Flex>
      <TrendingSectionHeader
        title="Recent Searches"
        actionLabel="Clear"
        onActionPress={() => GlobalStore.actions.search.clearRecentSearches()}
      />

      <FlatList
        horizontal
        data={recentSearches}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
        keyExtractor={(item, index) => `${index}-${item.props.href}`}
        renderItem={({ item }) => <RecentSearchPill result={item.props} />}
      />
    </Flex>
  )
}

const RecentSearchPill: React.FC<{ result: AutosuggestResult }> = ({ result }) => {
  const { trackEvent } = useTracking()
  const searchContext = useContext(SearchContext)

  const handlePress = () => {
    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchRecentItemSelected,
      // @ts-expect-error queryRef is loosely typed in SearchContext
      query: searchContext?.queryRef?.current ?? "",
      selected_object_type: result.displayType || result.__typename,
      selected_object_slug: result.slug,
    })
  }

  return (
    <RouterLink to={result.href} onPress={handlePress}>
      <Flex
        flexDirection="row"
        alignItems="center"
        backgroundColor="mono5"
        borderRadius={20}
        pl={0.5}
        pr={0.5}
        py={0.5}
        maxWidth={PILL_MAX_WIDTH}
      >
        <Flex
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          borderRadius={AVATAR_SIZE / 2}
          overflow="hidden"
          backgroundColor="mono10"
        >
          <ImageWithFallback src={result.imageUrl} width={AVATAR_SIZE} height={AVATAR_SIZE} />
        </Flex>

        <Text variant="xs" numberOfLines={1} mx={1} style={{ flexShrink: 1 }}>
          {result.displayLabel}
        </Text>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${result.displayLabel} from recent searches`}
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 12 }}
          onPress={() => GlobalStore.actions.search.deleteRecentSearch(result)}
        >
          <Flex width={22} height={22} alignItems="center" justifyContent="center">
            <CloseIcon width={14} height={14} fill="mono60" />
          </Flex>
        </Touchable>
      </Flex>
    </RouterLink>
  )
}
