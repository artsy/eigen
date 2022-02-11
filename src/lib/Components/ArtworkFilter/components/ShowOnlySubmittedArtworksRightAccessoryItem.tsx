import { useFeatureFlag } from "lib/store/GlobalStore"
import { Check, Checkbox } from "palette"
import React, { useEffect, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export const ShowOnlySubmittedArtworksRightAccessoryItem: React.FC<
  ArtworkFilterOptionItemProps
> = ({ count }) => {
  const [checked, setChecked] = useState(count ? count > 0 : false)

  useEffect(() => {
    setChecked(count ? count > 0 : false)
  }, [count])

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

  const onPress = () => {
    const nextValue = !checked
    setChecked(nextValue)
    setValueOnFilters(nextValue)
  }

  if (isEnabledImprovedAlertsFlow) {
    return <Checkbox checked={checked} onPress={onPress} />
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Check selected={checked} />
    </TouchableWithoutFeedback>
  )
}
