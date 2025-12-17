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

  const contextScreenOwnerType =
    selectedTab.toLocaleLowerCase() === "home" ? OwnerType.home : OwnerType.search

  const didMount = useRef(false)
  const previousQueryRef = useRef(query)
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

  // Initialize refs on mount
  useEffect(() => {
    didMount.current = true
    previousQueryRef.current = query
  }, [query])

  // Handle query reset when cleared
  useEffect(() => {
    if (!didMount.current) {
      return
    }

    if (query.length === 0) {
      trackEvent(tracks.trackSearchCleared(contextScreenOwnerType))
      handleResetSearchInput()
    }
  }, [query, contextScreenOwnerType, trackEvent])

  // Detect paste events and track search activity
  useEffect(() => {
    if (!didMount.current || query.length === 0) {
      return
    }

    const previousQuery = previousQueryRef.current
    previousQueryRef.current = query

    const isPaste = detectInputPasteEvent(query, previousQuery)
    if (isPaste) {
      trackEvent(tracks.trackPaste(contextScreenOwnerType, query))
    }

    trackEvent(tracks.trackSearchStarted(contextScreenOwnerType, query))
  }, [query, contextScreenOwnerType, trackEvent])

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
  trackPaste: (contextScreenOwnerType: OwnerType, query: string) => ({
    action_type: "pastedSearchQuery",
    context_screen_owner_type: contextScreenOwnerType,
    query,
  }),
}

/**
 * Detects paste events using heuristic-based approach
 * If text length changes by more than 1 character in a single change event,
 * it's likely a paste (multiple characters added at once) rather than typing
 */
const detectInputPasteEvent = (newQuery: string, previousQuery: string): boolean => {
  const lengthDifference = Math.abs(newQuery.length - previousQuery.length)
  return lengthDifference > 1
}
