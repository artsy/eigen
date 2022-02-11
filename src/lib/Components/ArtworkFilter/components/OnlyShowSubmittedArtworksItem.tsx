import { useFeatureFlag } from "lib/store/GlobalStore"
import { Checkbox } from "palette"
import React, { useState } from "react"
import { FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "../ArtworkFilterStore"
import { ArtworkFilterOptionItemProps } from "./ArtworkFilterOptionItem"

export const OnlyShowSubmittedArtworksItem: React.FC<ArtworkFilterOptionItemProps> = ({
  count,
}) => {
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

  // if (isEnabledImprovedAlertsFlow) {
  //   return (
  //     <Flex flexDirection="row" justifyContent="space-between" p={2} pr={1}>
  //       <Text variant="md">Only Show Submitted Artworks</Text>

  //       <Flex justifyContent="flex-end">
  //         <Checkbox
  //           checked={checked}
  //           onPress={() => {
  //             const nextValue = !checked
  //             setChecked(nextValue)
  //             setValueOnFilters(nextValue)
  //           }}
  //         />
  //       </Flex>
  //     </Flex>
  //   )
  // }

  // return (
  //   <Flex flexDirection="row" justifyContent="space-between" p={2} pr={1.5}>
  //     <Flex minWidth="45%">
  //       <Text variant="xs">Only Show Submitted Artworks</Text>
  //     </Flex>

  //     <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="flex-end">
  //       <Checkbox
  //         checked={checked}
  //         onPress={() => {
  //           const nextValue = !checked
  //           setChecked(nextValue)
  //           setValueOnFilters(nextValue)
  //         }}
  //       />
  //     </Flex>
  //   </Flex>
  // )
}
