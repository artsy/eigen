import AsyncStorage from "@react-native-async-storage/async-storage"
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
export const THREE_MONTHS_MS = 1000 // * 60 * 60 * 24 * 90 // 90 days

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
    // display toast only for the "Recommended Artworks" section
    if (sectionInternalID !== "home-view-section-recommended-artworks") {
      return
    }

    fetchPriceRange().then((result) => {
      if (result === false) {
        // user scrolls through 50% of artworks on the screen
        const hasScrolledEnough = totalCount > 0 && artworksLength / totalCount > 0.5

        if (totalCount === 0 || !hasScrolledEnough || hasShownPriceRangeToast.current) {
          return
        }

        hasShownPriceRangeToast.current = true // prevent parallel triggers

        const maybeShowToast = async () => {
          try {
            const lastShown = await AsyncStorage.getItem(PRICE_RANGE_TOAST_KEY)
            const lastShownDate = new Date(Number(lastShown || "0"))
            const now = new Date()

            const hasThreeMonthsPassed = now.getTime() - lastShownDate.getTime() > THREE_MONTHS_MS

            if (!hasThreeMonthsPassed) {
              return
            }

            await AsyncStorage.setItem(PRICE_RANGE_TOAST_KEY, String(now.getTime()))

            toast.show(PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE, "bottom", {
              description: PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT || undefined,
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
      } else return
    })
  }, [artworksLength, totalCount, sectionInternalID, toast])
}
