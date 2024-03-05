import { GlobalStore } from "app/store/GlobalStore"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"

export const useViewOptionNumColumns = (experimentName: string) => {
  const experiment = useExperimentVariant(experimentName)
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const forceShowNewWorksForYouFeed = useDevToggle("DTForceShowNewWorksForYouScreenFeed")

  if (forceShowNewWorksForYouFeed) {
    return defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1
  }

  return defaultViewOption === "grid" || experiment.variant === "control" ? NUM_COLUMNS_MASONRY : 1
}

export const usePlaceholderView = (experimentName: string) => {
  const experiment = useExperimentVariant(experimentName)
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const forceShowNewWorksForYouFeed = useDevToggle("DTForceShowNewWorksForYouScreenFeed")

  if (forceShowNewWorksForYouFeed) {
    return defaultViewOption
  }

  return experiment.variant === "control" || defaultViewOption === "grid" ? "grid" : "list"
}
