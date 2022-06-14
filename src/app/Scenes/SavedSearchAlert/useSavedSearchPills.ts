import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import { useMemo } from "react"
import { extractPills } from "./pillExtractors"
import { SavedSearchStore } from "./SavedSearchStore"

export const useSavedSearchPills = () => {
  const { localizedUnit } = useLocalizedUnit()
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const aggregations = SavedSearchStore.useStoreState((state) => state.aggregations)
  const entity = SavedSearchStore.useStoreState((state) => state.entity)

  return useMemo(
    () => extractPills({ attributes, aggregations, unit: localizedUnit, entity }),
    [attributes, aggregations, localizedUnit, entity]
  )
}
