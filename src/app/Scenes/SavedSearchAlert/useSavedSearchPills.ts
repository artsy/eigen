import { GlobalStore } from "app/store/GlobalStore"
import { useMemo } from "react"
import { extractPills } from "./pillExtractors"
import { SavedSearchStore } from "./SavedSearchStore"

export const useSavedSearchPills = () => {
  const userPreferredMetric =
    GlobalStore.useAppState((state) => state.userPreferences.metric) || "in"
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const aggregations = SavedSearchStore.useStoreState((state) => state.aggregations)

  return useMemo(
    () => extractPills({ attributes, aggregations, unit: userPreferredMetric }),
    [attributes, aggregations, userPreferredMetric]
  )
}
