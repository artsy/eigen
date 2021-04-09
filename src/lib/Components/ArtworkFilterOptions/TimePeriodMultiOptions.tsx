import { StackScreenProps } from "@react-navigation/stack"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  FilterDisplayName,
  FilterParamName,
  getDisplayNameForTimePeriod,
  ParamDefaultValues,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { FilterData } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { useArtworkFiltersAggregation } from "lib/utils/ArtworkFilter/useArtworkFilters"
import React, { useState } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface TimePeriodOptionsScreenProps
  extends StackScreenProps<FilterModalNavigationStack, "TimePeriodOptionsScreen"> {}

export const TimePeriodMultiOptionsScreen: React.FC<TimePeriodOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)
  const { aggregation } = useArtworkFiltersAggregation({ paramName: FilterParamName.timePeriod })

  const DEFAULT_OPTION: FilterData = {
    displayText: "All",
    paramName: FilterParamName.timePeriod,
    paramValue: ParamDefaultValues.majorPeriods,
  }

  const TIME_PERIOD_OPTIONS: FilterData[] = [
    DEFAULT_OPTION,
    ...(aggregation?.counts ?? []).map((c) => {
      return {
        displayText: getDisplayNameForTimePeriod(c.name),
        paramName: FilterParamName.timePeriod,
        paramValue: c.value,
      }
    }),
  ]

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedTimePeriodOptions = selectedOptions.find((option) => {
    return option.paramName === FilterParamName.timePeriod
  })

  const [nextOptions, setNextOptions] = useState<string[]>((selectedTimePeriodOptions?.paramValue as string[]) ?? [])

  const handleSelect = (option: FilterData, updatedValue: boolean) => {
    if (updatedValue) {
      setNextOptions((prev) => {
        let next = []

        // If the `All` toggle is selected; reset the filters to the default value (`[]`)
        if (option.displayText === DEFAULT_OPTION.displayText) {
          next = ParamDefaultValues.majorPeriods
        } else {
          // Otherwise append it
          next = [
            ...prev,
            TIME_PERIOD_OPTIONS.find(({ displayText }) => {
              return displayText === option.displayText
            })?.paramValue as string,
          ]
        }

        selectFiltersAction({
          displayText: option.displayText,
          paramValue: next,
          paramName: option.paramName,
        })

        return next
      })
    } else {
      setNextOptions((prev) => {
        let next = prev.filter((value) => {
          return (
            value !==
            (TIME_PERIOD_OPTIONS.find(({ displayText }) => {
              return displayText === option.displayText
            })?.paramValue as string)
          )
        })

        // If nothing is selected toggle the default value (`[]`)
        if (next.length === 0) {
          next = ParamDefaultValues.majorPeriods
        }

        selectFiltersAction({
          displayText: option.displayText,
          paramValue: next,
          paramName: option.paramName,
        })

        return next
      })
    }
  }

  const filterOptions = TIME_PERIOD_OPTIONS.map((option) => {
    if (option.displayText === DEFAULT_OPTION.displayText) {
      return { ...option, paramValue: nextOptions.length === 0 }
    }

    return { ...option, paramValue: nextOptions.includes(option.paramValue as string) }
  })

  return (
    <MultiSelectOptionScreen
      onSelect={handleSelect}
      filterHeaderText={FilterDisplayName.timePeriod}
      filterOptions={filterOptions}
      navigation={navigation}
    />
  )
}
