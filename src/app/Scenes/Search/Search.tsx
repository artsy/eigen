import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, Screen, Spacer, useSpace } from "@artsy/palette-mobile"
import { PortalHost } from "@gorhom/portal"
import { StackScreenProps } from "@react-navigation/stack"
import * as Sentry from "@sentry/react-native"
import { withProfiler } from "@sentry/react-native"
import { SearchQuery, SearchQuery$variables } from "__generated__/SearchQuery.graphql"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { useRefetchWhenQueryChanged } from "app/Scenes/Search/useRefetchWhenQueryChanged"
import { useSearchQuery } from "app/Scenes/Search/useSearchQuery"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { Schema } from "app/utils/track"
import { memo, RefObject, Suspense, useRef, useState } from "react"
import { KeyboardAvoidingView, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { SearchResults } from "./SearchResults"
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
}

export const Search: React.FC = () => {
  const space = useSpace()

  const searchPillsRef = useRef<ScrollView>(null)
  const searchInputRef = useRef<GlobalSearchInput>(null)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)

  const scrollYOffset = useRef(0)
  const { trackEvent } = useTracking()

  const shouldShowCityGuide = !isTablet()

  const {
    data: queryData,
    refetch,
    isLoading,
  } = useSearchQuery<SearchQuery>(SearchScreenQuery, searchQueryDefaultVariables)

  useRefetchWhenQueryChanged({ query: searchQuery, refetch })

  const scrollableRef = useBottomTabsScrollToTop(() => {
    // Focus input and open keyboard on bottom nav Search tab double-tab
    if (scrollYOffset.current <= 0) {
      searchInputRef.current?.focus()
    }
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

  const handleScroll = (event: any) => {
    scrollYOffset.current = event.nativeEvent.contentOffset.y
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Flex px={2} pt={2}>
        <GlobalSearchInput ownerType={OwnerType.search} ref={searchInputRef} />
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
          <ScrollView
            ref={scrollableRef as RefObject<ScrollView>}
            onScroll={handleScroll}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingTop: space(2) }}
          >
            <HorizontalPadding>{!!shouldShowCityGuide && <CityGuideCTA />}</HorizontalPadding>

            <Spacer y={4} />
          </ScrollView>
        )}
      </Flex>
    </KeyboardAvoidingView>
  )
}

export const SearchScreenQuery = graphql`
  query SearchQuery($term: String!, $skipSearchQuery: Boolean!) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
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
