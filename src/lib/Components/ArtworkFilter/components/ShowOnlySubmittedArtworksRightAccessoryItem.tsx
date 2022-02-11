import { useFeatureFlag } from "lib/store/GlobalStore"
import { Checkbox } from "palette"
import React, { useState } from "react"
import { FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export const ShowOnlySubmittedArtworksRightAccessoryItem: React.FC<
  ArtworkFilterOptionItemProps
> = ({ count }) => {
  const [checked, setChecked] = useState(count ? count > 0 : false)

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  const setValueOnFilters = (showOnlySubmitted: boolean) => {
    selectFiltersAction({
      paramName: FilterParamName.showOnlySubmittedArtworks,
      paramValue: showOnlySubmitted,
      displayText: "Show Only Submitted Artworks",
    })
  }

  return (
    <Checkbox
      checked={checked}
      onPress={() => {
        const nextValue = !checked
        setChecked(nextValue)
        setValueOnFilters(nextValue)
      }}
    />
  )
}
