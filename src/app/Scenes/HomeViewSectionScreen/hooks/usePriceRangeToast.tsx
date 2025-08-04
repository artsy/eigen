import { ActionType, OwnerType, TappedToast, ViewedToast } from "@artsy/cohesion"
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

export const PRICE_RANGE_TOAST_KEY = "priceRangeToastLastShown"

export interface PriceRangeToastProps {
  artworksLength: number
  totalCount: number
  sectionInternalID: string
}

export function usePriceRangeToast({
  artworksLength,
  totalCount,
  sectionInternalID,
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
      const hasScrolledEnough = totalCount > 0 && artworksLength / totalCount > 0.5

      if (totalCount === 0 || !hasScrolledEnough || hasShownPriceRangeToast.current) {
        return
      }

      // prevent parallel triggers
      hasShownPriceRangeToast.current = true

      const maybeShowToast = async () => {
        addClue(toastName)
        try {
          toast.show(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
            description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
            duration: "long",
            onPress: () => {
              tracking.trackEvent(tracks.onToastPress())

              InteractionManager.runAfterInteractions(() => {
                navigate("my-account/edit-price-range")
              })
            },
            hideOnPress: true,
          })

          tracking.trackEvent(tracks.onToastView())

          setTimeout(() => {
            setVisualClueAsSeen(toastName)
          })
        } catch (e) {
          console.error("Failed to show price range toast", e)
        }
      }

      maybeShowToast()
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
  ])
}

const tracks = {
  onToastPress: (): TappedToast => {
    return {
      action: ActionType.tappedToast,
      context_screen_owner_type: OwnerType.artworkRecommendations,
      subject: "price-range-toast",
    }
  },

  onToastView: (): ViewedToast => {
    return {
      action: ActionType.viewedToast,
      context_screen_owner_type: OwnerType.artworkRecommendations,
      subject: "price-range-toast",
    }
  },
}
