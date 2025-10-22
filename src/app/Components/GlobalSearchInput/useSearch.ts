import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { GlobalSearchInputOverlayQuery } from "__generated__/GlobalSearchInputOverlayQuery.graphql"
import { globalSearchInputOverlayQuery } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { SEARCH_THROTTLE_INTERVAL, TOP_PILL } from "app/Scenes/Search/constants"
import { getContextModuleByPillName } from "app/Scenes/Search/helpers"
import { PillType } from "app/Scenes/Search/types"
import { useRefetchWhenQueryChanged } from "app/Scenes/Search/useRefetchWhenQueryChanged"
import { useSearchQuery } from "app/Scenes/Search/useSearchQuery"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { Schema } from "app/utils/track"
import { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import useThrottle from "react-use/lib/useThrottle"

export const useSearch = ({ query }: { query: string }) => {
  const throttledQuery = useThrottle(query, SEARCH_THROTTLE_INTERVAL)
  const selectedTab = useSelectedTab()

  const contextScreenOwnerType = selectedTab === "home" ? OwnerType.home : OwnerType.search

  const didMount = useRef(false)
  const searchPillsRef = useRef<ScrollView>(null)

  const {
    data: queryData,
    refetch,
    isLoading,
  } = useSearchQuery<GlobalSearchInputOverlayQuery>(globalSearchInputOverlayQuery, {
    term: throttledQuery,
    skipSearchQuery: false,
  })

  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const { trackEvent } = useTracking()

  const searchProviderValues = useSearchProviderValues(query)

  useRefetchWhenQueryChanged({ query: throttledQuery.trim(), refetch })

  const handlePillPress = (pill: PillType) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    setSelectedPill(pill)
    trackEvent(tracks.tappedPill(contextModule, contextScreenOwnerType, pill.displayName, query))
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (query.length === 0) {
      trackEvent(tracks.trackSearchCleared(contextScreenOwnerType))
      handleResetSearchInput()

      return
    }

    trackEvent(tracks.trackSearchStarted(contextScreenOwnerType, query))
  }, [query.trim()])

  const handleResetSearchInput = () => {
    searchPillsRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    setSelectedPill(TOP_PILL)
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.key === pill.key
  }

  return {
    data: queryData,
    refetch,
    isLoading,
    queryData,
    selectedPill,
    handlePillPress,
    isSelected,
    searchPillsRef,
    searchProviderValues,
  }
}

const tracks = {
  tappedPill: (
    contextModule: ContextModule,
    contextScreenOwnerType: OwnerType,
    subject: string,
    query: string
  ) => ({
    context_screen_owner_type: contextScreenOwnerType,
    context_screen: contextScreenOwnerType,
    context_module: contextModule,
    subject,
    query,
    action: ActionType.tappedNavigationTab,
  }),
  trackSearchStarted: (contextScreenOwnerType: OwnerType, query: string) => ({
    context_screen_owner_type: contextScreenOwnerType,
    action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
    query,
  }),
  trackSearchCleared: (contextScreenOwnerType: OwnerType) => ({
    action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
    context_screen_owner_type: contextScreenOwnerType,
  }),
}
