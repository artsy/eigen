import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useRef } from "react"

interface UseRefreshLiveHomeViewSectionsProps {
  hasLiveSections: boolean
  refresh: () => void
}

/**
 * Refreshes Home's live rails when the user actually sees Home — not just when
 * Home regains navigation focus. If the search overlay is on top, focus alone
 * would trigger a refetch that re-fires `railViewed` / `itemViewed` for a Home
 * the user isn't looking at. This hook defers the refresh until the overlay
 * closes with Home still focused.
 *
 * Wire the returned `onSearchOverlayVisibilityChange` into GlobalSearchInput.
 */
export const useRefreshLiveHomeViewSections = ({
  hasLiveSections,
  refresh,
}: UseRefreshLiveHomeViewSectionsProps) => {
  // Refs (not state) so overlay toggles don't re-render HomeView, and so the
  // close handler below can stay `useCallback([])` — a stable identity matters
  // because GlobalSearchInput's cleanup effect would emit a spurious `false`
  // if the callback prop changed.
  const hasFocusedHomeOnceRef = useRef(false)
  const isHomeFocusedRef = useRef(false)
  const isSearchOverlayVisibleRef = useRef(false)
  const hasPendingRefreshRef = useRef(false)
  // Mirrored so the close handler (empty deps) can read the latest values.
  const hasLiveSectionsRef = useRef(hasLiveSections)
  const refreshRef = useRef(refresh)

  hasLiveSectionsRef.current = hasLiveSections
  refreshRef.current = refresh

  // Inactive screens may be frozen, so focus remains the source of truth for returning to Home.
  useFocusEffect(
    useCallback(() => {
      isHomeFocusedRef.current = true

      if (hasLiveSections) {
        if (!hasFocusedHomeOnceRef.current) {
          // First focus: initial query already delivered fresh data, skip refetch.
          hasFocusedHomeOnceRef.current = true
        } else if (isSearchOverlayVisibleRef.current) {
          // Overlay covers Home — defer the refresh until it closes.
          hasPendingRefreshRef.current = true
        } else {
          hasPendingRefreshRef.current = false
          refreshRef.current()
        }
      }

      return () => {
        isHomeFocusedRef.current = false
      }
    }, [hasLiveSections])
  )

  // Fires the deferred refresh at the moment Home becomes visible again — i.e.
  // overlay just closed, a refresh was actually pending, and Home is focused.
  const onSearchOverlayVisibilityChange = useCallback((isVisible: boolean) => {
    const justClosed = isSearchOverlayVisibleRef.current && !isVisible
    isSearchOverlayVisibleRef.current = isVisible

    if (
      justClosed &&
      hasPendingRefreshRef.current &&
      isHomeFocusedRef.current &&
      hasLiveSectionsRef.current
    ) {
      hasPendingRefreshRef.current = false
      refreshRef.current()
    }
  }, [])

  return { onSearchOverlayVisibilityChange }
}
