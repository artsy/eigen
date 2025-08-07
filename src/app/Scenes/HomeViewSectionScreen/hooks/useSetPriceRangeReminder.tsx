import { ActionType, ScreenOwnerType, TappedToast, ViewedToast } from "@artsy/cohesion"
import { fetchPriceRange } from "app/Components/PriceRange/fetchPriceRange"
import {
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
import { useToast } from "app/Components/Toast/toastHook"
import { VisualCluesConstMap } from "app/store/config/visualClues"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { addClue, setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"
import { useEffect, useRef } from "react"
import { InteractionManager } from "react-native"
import { useTracking } from "react-tracking"

const SCROLL_THRESHOLD = 0.5

export interface PriceRangeToastProps {
  artworksLength: number
  totalCount: number
  sectionInternalID: string
  contextScreenOwnerType: ScreenOwnerType
}

export function useSetPriceRangeReminder({
  artworksLength,
  totalCount,
  sectionInternalID,
  contextScreenOwnerType,
}: PriceRangeToastProps) {
  const toast = useToast()
  const tracking = useTracking()
  const hasShownPriceRangeToast = useRef(false)
  const enablePriceRangeToast = useFeatureFlag("AREnablePriceRangeToast")
  const { seenVisualClues } = useVisualClue()
  const toastName = VisualCluesConstMap.PriceRangeToast
  const hasSeenToast = !!seenVisualClues.find((clue) => clue === toastName)

  useEffect(() => {
    // proceed only for the "We Think You'll Love" section screen
    if (
      sectionInternalID !== "home-view-section-recommended-artworks" ||
      !enablePriceRangeToast ||
      hasSeenToast
    ) {
      return
    }

    fetchPriceRange().then(({ hasPriceRange, hasStaleArtworkBudget }) => {
      if (!hasPriceRange || !hasStaleArtworkBudget) return

      // user scrolls through 50% of artworks on the screen
      const hasScrolledEnough = totalCount > 0 && artworksLength / totalCount > SCROLL_THRESHOLD

      if (totalCount === 0 || !hasScrolledEnough || hasShownPriceRangeToast.current) {
        return
      }

      // prevent parallel triggers
      hasShownPriceRangeToast.current = true

      const showToast = async () => {
        addClue(toastName)
        try {
          toast.show(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
            description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
            duration: "long",
            onPress: () => {
              tracking.trackEvent(tracks.onToastPress(contextScreenOwnerType))

              InteractionManager.runAfterInteractions(() => {
                navigate("my-account/edit-price-range")
              })
            },
            hideOnPress: true,
          })

          tracking.trackEvent(tracks.onToastView(contextScreenOwnerType))

          setTimeout(() => {
            setVisualClueAsSeen(toastName)
          })
        } catch (e) {
          console.error("Failed to show price range toast", e)
        }
      }

      showToast()
    })
  }, [
    artworksLength,
    totalCount,
    sectionInternalID,
    toast,
    tracking,
    enablePriceRangeToast,
    hasSeenToast,
    toastName,
    contextScreenOwnerType,
  ])
}

const tracks = {
  onToastPress: (contextScreenOwnerType: ScreenOwnerType): TappedToast => {
    return {
      action: ActionType.tappedToast,
      context_screen_owner_type: contextScreenOwnerType,
      subject: "price-range-toast",
    }
  },

  onToastView: (contextScreenOwnerType: ScreenOwnerType): ViewedToast => {
    return {
      action: ActionType.viewedToast,
      context_screen_owner_type: contextScreenOwnerType,
      subject: "price-range-toast",
    }
  },
}
