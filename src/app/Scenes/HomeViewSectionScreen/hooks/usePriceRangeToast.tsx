import {
  fetchPriceRange,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE,
} from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
import { useToast } from "app/Components/Toast/toastHook"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useEffect, useRef } from "react"
import { InteractionManager } from "react-native"

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
  const hasShownPriceRangeToast = useRef(false)

  useEffect(() => {
    // proceed only for the "We Think You'll Love" section screen
    if (sectionInternalID !== "home-view-section-recommended-artworks") {
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
        try {
          toast.show(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
            description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT,
            duration: "long",
            onPress: () => {
              InteractionManager.runAfterInteractions(() => {
                navigate("my-account/edit-price-range")
              })
            },
            hideOnPress: true,
          })
        } catch (e) {
          console.error("Failed to maybe show price range toast", e)
        }
      }

      maybeShowToast()
    })
  }, [artworksLength, totalCount, sectionInternalID, toast])
}
