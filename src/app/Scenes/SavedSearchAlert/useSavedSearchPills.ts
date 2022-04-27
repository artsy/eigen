import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { useMemo } from "react"
import { extractPills } from "./pillExtractors"
import { SavedSearchStore } from "./SavedSearchStore"

export const useSavedSearchPills = () => {
  const { localizedUnit } = useLocalizedUnit()
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const aggregations = SavedSearchStore.useStoreState((state) => state.aggregations)

  return useMemo(
    () => extractPills({ attributes, aggregations, unit: localizedUnit }),
    [attributes, aggregations, localizedUnit]
  )
}
