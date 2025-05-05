import { OwnerType } from "@artsy/cohesion"
import { FilterIcon } from "@artsy/icons/native"
import { Box, Flex, RoundSearchInput, Spacer, Spinner, useSpace } from "@artsy/palette-mobile"
import { Portal } from "@gorhom/portal"
import { useNavigation } from "@react-navigation/native"
import { FadeIn } from "app/Components/FadeIn"
import { GlobalSearchInputOverlayEmptyState } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlayEmptyState"
import { useSearch } from "app/Components/GlobalSearchInput/useSearch"
import { DEFAULT_ICON_SIZE, ICON_HIT_SLOP } from "app/Components/constants"
import { RecentSearches } from "app/Scenes/Search/RecentSearches"
import { SEARCH_INPUT_PLACEHOLDER, shouldStartSearching } from "app/Scenes/Search/Search"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { useRecentSearches } from "app/Scenes/Search/SearchModel"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { SearchResults } from "app/Scenes/Search/SearchResults"
import { SEARCH_PILLS } from "app/Scenes/Search/constants"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Suspense, useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"

export const globalSearchInputOverlayQuery = graphql`
  query GlobalSearchInputOverlayQuery($term: String!, $skipSearchQuery: Boolean!) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
    ...CuratedCollections_collections
    ...TrendingArtists_query
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

  return (
    <SearchContext.Provider value={searchProviderValues}>
      {shouldStartSearching(query) && !!data.viewer ? (
        <>
          <Box pb={1}>
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
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: space(2),
          }}
        >
          {recentSearches.length ? <RecentSearches /> : <GlobalSearchInputOverlayEmptyState />}
        </ScrollView>
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
  const insets = useSafeAreaInsets()
  const { goBack, canGoBack } = useNavigation()

  const enableCollect = useFeatureFlag("AREnableCollectSearch")

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
    if (!visible) {
      setQuery("")
    }
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <FadeIn style={{ flex: 1 }} slide={false}>
      <Portal hostName={`${ownerType}-SearchOverlay`}>
        <Flex style={{ ...StyleSheet.absoluteFillObject }}>
          <Flex flex={1} backgroundColor="mono0" style={{ ...insets }}>
            <Flex px={2} pt={2}>
              <Flex flexDirection="row" alignItems="center" gap={1}>
                <Flex flex={1}>
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
                {!!enableCollect && (
                  <RouterLink to="/collect" hitSlop={ICON_HIT_SLOP}>
                    <FilterIcon height={DEFAULT_ICON_SIZE} width={DEFAULT_ICON_SIZE} />
                  </RouterLink>
                )}
              </Flex>
            </Flex>

            <Spacer y={2} />

            <Suspense fallback={Spinner}>
              <GlobalSearchInputOverlayContent query={query} />
            </Suspense>
          </Flex>
        </Flex>
      </Portal>
    </FadeIn>
  )
}
