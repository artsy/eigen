import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, RoundSearchInput, Spacer, useSpace } from "@artsy/palette-mobile"
import { Portal } from "@gorhom/portal"
import { useNavigation } from "@react-navigation/native"
import { GlobalSearchInputOverlayEmptyState } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlayEmptyState"
import { useSearch } from "app/Components/GlobalSearchInput/useSearch"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { DEFAULT_SCREEN_ANIMATION_DURATION } from "app/Components/constants"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { RecentSearches } from "app/Scenes/Search/RecentSearches"
import { SEARCH_INPUT_PLACEHOLDER, shouldStartSearching } from "app/Scenes/Search/Search"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { useRecentSearches } from "app/Scenes/Search/SearchModel"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { SearchResults } from "app/Scenes/Search/SearchResults"
import { TrendingSearches } from "app/Scenes/Search/TrendingSearches/TrendingSearches"
import { SEARCH_PILLS } from "app/Scenes/Search/constants"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Suspense, useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { KeyboardController, KeyboardStickyView } from "react-native-keyboard-controller"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"

export const globalSearchInputOverlayQuery = graphql`
  query GlobalSearchInputOverlayQuery($term: String!, $skipSearchQuery: Boolean!) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
  }
`

const GlobalSearchInputOverlayContent: React.FC<{ query: string }> = ({ query }) => {
  const space = useSpace()
  const {
    data,
    isSelected,
    handlePillPress,
    searchPillsRef,
    selectedPill,
    searchProviderValues,
    isLoading,
    refetch,
  } = useSearch({ query })

  const recentSearches = useRecentSearches()
  const showTrendingSearches = useFeatureFlag("AREnableTrendingSearchesInSearchModal")

  const renderIdleState = () => {
    if (showTrendingSearches) {
      return <TrendingSearches />
    }

    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: space(2),
          paddingBottom: space(6),
        }}
      >
        {recentSearches.length ? <RecentSearches /> : <GlobalSearchInputOverlayEmptyState />}
      </ScrollView>
    )
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      {shouldStartSearching(query) && !!data.viewer ? (
        <>
          <Box mb={1}>
            <SearchPills
              viewer={data.viewer}
              ref={searchPillsRef}
              pills={SEARCH_PILLS}
              onPillPress={handlePillPress}
              isSelected={isSelected}
              isLoading={isLoading}
            />
          </Box>
          <SearchResults
            selectedPill={selectedPill}
            query={query}
            onRetry={() => {
              refetch({ term: query, skipSearchQuery: false })
            }}
          />
        </>
      ) : (
        renderIdleState()
      )}
    </SearchContext.Provider>
  )
}

export const GlobalSearchInputOverlay: React.FC<{
  ownerType: OwnerType
  visible: boolean
  hideModal: () => void
}> = ({ hideModal, ownerType, visible }) => {
  const [query, setQuery] = useState("")
  const [shouldRender, setShouldRender] = useState(false)
  const insets = useSafeAreaInsets()
  const { goBack, canGoBack } = useNavigation()
  const opacity = useSharedValue(0)
  const enableArtsyLens = useExperimentFlag("onyx_artsy-lens")

  useBackHandler(() => {
    if (!!canGoBack()) {
      goBack()
      return true
    }

    if (visible) {
      hideModal()
      return true
    }

    return false
  })

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      opacity.value = withTiming(1, { duration: DEFAULT_SCREEN_ANIMATION_DURATION })
    } else {
      KeyboardController.dismiss()
      opacity.value = withTiming(0, { duration: DEFAULT_SCREEN_ANIMATION_DURATION }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false)
        }
      })
      setQuery("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  if (!shouldRender) {
    return null
  }

  return (
    <Portal hostName={`${ownerType}-SearchOverlay`}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Flex
          flex={1}
          backgroundColor="mono0"
          style={{ top: insets.top, marginBottom: insets.bottom }}
        >
          <Flex px={2} mt={2}>
            <RoundSearchInput
              placeholder={SEARCH_INPUT_PLACEHOLDER}
              accessibilityHint="Search artists, artworks, galleries etc."
              accessibilityLabel="Search artists, artworks, galleries etc."
              maxLength={55}
              numberOfLines={1}
              onChangeText={setQuery}
              autoFocus
              multiline={false}
              onLeftIconPress={() => {
                hideModal()
              }}
            />
          </Flex>

          <Spacer y={2} />

          <Suspense fallback={null}>
            <GlobalSearchInputOverlayContent query={query} />
          </Suspense>
        </Flex>

        {!!enableArtsyLens && (
          <Flex position="absolute" left={0} right={0} bottom={insets.bottom}>
            <KeyboardStickyView offset={{ closed: -BOTTOM_TABS_HEIGHT, opened: insets.bottom }}>
              <Flex px={2} pb={1}>
                <SearchByPhotoButton
                  onPress={() => {
                    hideModal()
                    navigate("/lens")
                  }}
                />
              </Flex>
            </KeyboardStickyView>
          </Flex>
        )}
      </Animated.View>
    </Portal>
  )
}
