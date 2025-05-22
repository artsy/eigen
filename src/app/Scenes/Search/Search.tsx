import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, Screen, Spacer } from "@artsy/palette-mobile"
import { PortalHost } from "@gorhom/portal"
import { useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { withProfiler } from "@sentry/react-native"
import * as Sentry from "@sentry/react-native"
import { SearchQuery, SearchQuery$variables } from "__generated__/SearchQuery.graphql"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { HomeViewSectionCardsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionCards"
import { HomeViewSectionCardsChipsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionCardsChips"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { useRefetchWhenQueryChanged } from "app/Scenes/Search/useRefetchWhenQueryChanged"
import { useSearchQuery } from "app/Scenes/Search/useSearchQuery"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { Schema } from "app/utils/track"
import { memo, Suspense, useEffect, useRef, useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { CuratedCollections } from "./CuratedCollections"
import { SearchContext, useSearchProviderValues } from "./SearchContext"
import { SearchResults } from "./SearchResults"
import { TrendingArtists } from "./TrendingArtists"
import { CityGuideCTA } from "./components/CityGuideCTA"
import { SearchPlaceholder } from "./components/placeholders/SearchPlaceholder"
import { SEARCH_PILLS, TOP_PILL } from "./constants"
import { getContextModuleByPillName } from "./helpers"
import { PillType } from "./types"

export const SEARCH_INPUT_PLACEHOLDER = [
  "Search artists, artworks, galleries, etc.",
  "Search artists, artworks, etc.",
  "Search artworks, etc.",
  "Search",
]

export const searchQueryDefaultVariables: SearchQuery$variables = {
  term: "",
  skipSearchQuery: true,
  isDiscoverVariant: false,
}

export const Search: React.FC = () => {
  const searchPillsRef = useRef<ScrollView>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const searchProviderValues = useSearchProviderValues(searchQuery)
  const { trackEvent } = useTracking()
  const isAndroid = Platform.OS === "android"
  const navigation = useNavigation()
  const { variant } = useExperimentVariant("diamond_discover-tab")
  const isDiscoverVariant = variant.name === "variant-a" && variant.enabled

  const shouldShowCityGuide = Platform.OS === "ios" && !isTablet()

  const searchQueryVariables = {
    ...searchQueryDefaultVariables,
    isDiscoverVariant,
  }

  const {
    data: queryData,
    refetch,
    isLoading,
  } = useSearchQuery<SearchQuery>(SearchScreenQuery, searchQueryVariables)

  useRefetchWhenQueryChanged({ query: searchQuery, refetch })

  const scrollableRef = useBottomTabsScrollToTop(() => {
    // Focus input and open keyboard on bottom nav Search tab double-tab
    searchProviderValues.inputRef.current?.focus()
  })

  // TODO: to be removed on ES results PR
  const handleRetry = () => {
    setSearchQuery((prevState) => prevState)
  }

  const handlePillPress = (pill: PillType) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    setSelectedPill(pill)
    trackEvent(tracks.tappedPill(contextModule, pill.displayName, searchQuery))
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.key === pill.key
  }

  useEffect(() => {
    if (searchProviderValues.inputRef?.current && isAndroid) {
      const unsubscribe = navigation?.addListener("focus", () => {
        // setTimeout here is to make sure that the search screen is focused in order to focus on text input
        // without that the searchInput is not focused
        setTimeout(() => searchProviderValues.inputRef.current?.focus(), 200)
      })

      return unsubscribe
    }
  }, [navigation, searchProviderValues.inputRef.current])

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Flex px={2} pt={2}>
          <GlobalSearchInput ownerType={OwnerType.search} />
        </Flex>
        <Flex flex={1} collapsable={false}>
          {shouldStartSearching(searchQuery) && !!queryData.viewer ? (
            <>
              <Box pt={2} pb={1}>
                <SearchPills
                  viewer={queryData.viewer}
                  ref={searchPillsRef}
                  pills={SEARCH_PILLS}
                  onPillPress={handlePillPress}
                  isSelected={isSelected}
                  isLoading={isLoading}
                />
              </Box>
              <SearchResults
                selectedPill={selectedPill}
                query={searchQuery}
                // TODO: to be removed on ES results PR
                onRetry={handleRetry}
              />
            </>
          ) : (
            <Scrollable ref={scrollableRef}>
              {!isDiscoverVariant && <TrendingArtists data={queryData} mb={4} />}
              {!isDiscoverVariant && <CuratedCollections collections={queryData} mb={4} />}

              {!!isDiscoverVariant && (
                <HomeViewSectionCardsChipsQueryRenderer
                  sectionID="home-view-section-discover-something-new"
                  index={0}
                />
              )}
              {!!isDiscoverVariant && (
                <HomeViewSectionCardsQueryRenderer
                  sectionID="home-view-section-explore-by-category"
                  index={0}
                />
              )}

              <HorizontalPadding>{!!shouldShowCityGuide && <CityGuideCTA />}</HorizontalPadding>

              <Spacer y={4} />
            </Scrollable>
          )}
        </Flex>
      </KeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

export const SearchScreenQuery = graphql`
  query SearchQuery(
    $term: String!
    $skipSearchQuery: Boolean!
    $isDiscoverVariant: Boolean = false
  ) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
    ...CuratedCollections_collections @skip(if: $isDiscoverVariant)
    ...TrendingArtists_query @skip(if: $isDiscoverVariant)
  }
`

type SearchScreenProps = StackScreenProps<any>

const SearchScreenInner: React.FC<SearchScreenProps> = () => {
  return (
    <>
      <Screen>
        <Suspense fallback={<SearchPlaceholder />}>
          <Sentry.TimeToInitialDisplay record>
            <Search />
          </Sentry.TimeToInitialDisplay>
        </Suspense>
      </Screen>
      <PortalHost name={`${OwnerType.search}-SearchOverlay`} />
    </>
  )
}

export const SearchScreen = memo(withProfiler(SearchScreenInner, { name: "Search" }))

const Scrollable = styled(ScrollView).attrs(() => ({
  keyboardDismissMode: "on-drag",
  keyboardShouldPersistTaps: "handled",
}))`
  flex: 1;
  padding-top: 20px;
`

const HorizontalPadding: React.FC = ({ children }) => {
  return <Box px={2}>{children}</Box>
}

const tracks = {
  tappedPill: (contextModule: ContextModule, subject: string, query: string) => ({
    context_screen_owner_type: OwnerType.search,
    context_screen: Schema.PageNames.Search,
    context_module: contextModule,
    subject,
    query,
    action: ActionType.tappedNavigationTab,
  }),
}

export const shouldStartSearching = (value: string) => {
  return value.length >= 2
}
