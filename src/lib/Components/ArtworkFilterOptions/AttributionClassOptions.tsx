import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useState } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface AttributionClassOptionsScreenProps
  extends StackScreenProps<FilterModalNavigationStack, "AttributionClassOptionsScreen"> {}

export const ATTRIBUTION_CLASS_OPTIONS: FilterData[] = [
  {
    displayText: "Unique",
    paramName: FilterParamName.attributionClass,
    paramValue: "unique",
  },
  {
    displayText: "Limited Edition",
    paramName: FilterParamName.attributionClass,
    paramValue: "limited edition",
  },
  {
    displayText: "Open Edition",
    paramName: FilterParamName.attributionClass,
    paramValue: "open edition",
  },
  {
    displayText: "Unknown Edition",
    paramName: FilterParamName.attributionClass,
    paramValue: "unknown edition",
  },
]

export const AttributionClassOptionsScreen: React.FC<AttributionClassOptionsScreenProps> = ({ navigation }) => {
  const selectedOptions = useSelectedOptionsDisplay()

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const selectedAttributionClassOptions = selectedOptions.find((option) => {
    return option.paramName === FilterParamName.attributionClass
  })

  const [nextOptions, setNextOptions] = useState<string[]>(
    (selectedAttributionClassOptions?.paramValue as string[]) ?? []
  )

  const handleSelect = (option: FilterData, updatedValue: boolean) => {
    if (updatedValue) {
      setNextOptions((prev) => {
        const next = [
          ...prev,
          ATTRIBUTION_CLASS_OPTIONS.find(({ displayText }) => {
            return displayText === option.displayText
          })?.paramValue as string,
        ]

        selectFiltersAction({
          displayText: option.displayText,
          paramValue: next,
          paramName: option.paramName,
        })

        return next
      })
    } else {
      setNextOptions((prev) => {
        const next = prev.filter((value) => {
          return (
            value !==
            (ATTRIBUTION_CLASS_OPTIONS.find(({ displayText }) => {
              return displayText === option.displayText
            })?.paramValue as string)
          )
        })

        selectFiltersAction({
          displayText: option.displayText,
          paramValue: next,
          paramName: option.paramName,
        })

        return next
      })
    }
  }

  const filterOptions = ATTRIBUTION_CLASS_OPTIONS.map((option) => {
    return { ...option, paramValue: nextOptions.includes(option.paramValue as string) }
  })

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.attributionClass}
      filterOptions={filterOptions}
      navigation={navigation}
    />
  )
}
