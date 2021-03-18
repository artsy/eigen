import { StackScreenProps } from "@react-navigation/stack"
import {
  ArtworkFilterContext,
  FilterData,
  ParamDefaultValues,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterDisplayName, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useContext, useState } from "react"
import { FilterModalNavigationStack } from "../FilterModal"
import { MultiSelectOptionScreen } from "./MultiSelectOption"

interface LocationOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "LocationOptionsScreen"> {}

export const LocationOptionsScreen: React.FC<LocationOptionsScreenProps> = ({ navigation }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const aggregation = aggregationForFilter(FilterParamName.locationCities, state.aggregations)

  const DEFAULT_OPTION: FilterData = {
    displayText: "All",
    paramName: FilterParamName.locationCities,
    paramValue: ParamDefaultValues.locationCities,
  }

  const LOCATION_OPTIONS: FilterData[] = [
    DEFAULT_OPTION,
    ...(aggregation?.counts ?? []).map((c) => {
      return {
        displayText: c.name,
        paramName: FilterParamName.locationCities,
        paramValue: c.value,
      }
    }),
  ]

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedLocationOptions = selectedOptions.find((option) => {
    return option.paramName === FilterParamName.locationCities
  })

  const [nextOptions, setNextOptions] = useState<string[]>((selectedLocationOptions?.paramValue as string[]) ?? [])

  const handleSelect = (option: FilterData, updatedValue: boolean) => {
    if (updatedValue) {
      setNextOptions((prev) => {
        let next = []

        // If the `All` toggle is selected; reset the filters to the default value (`[]`)
        if (option.displayText === DEFAULT_OPTION.displayText) {
          next = ParamDefaultValues.locationCities
        } else {
          // Otherwise append it
          next = [
            ...prev,
            LOCATION_OPTIONS.find(({ displayText }) => {
              return displayText === option.displayText
            })?.paramValue as string,
          ]
        }

        dispatch({
          type: "selectFilters",
          payload: {
            displayText: option.displayText,
            paramValue: next,
            paramName: option.paramName,
          },
        })

        return next
      })
    } else {
      setNextOptions((prev) => {
        let next = prev.filter((value) => {
          return (
            value !==
            (LOCATION_OPTIONS.find(({ displayText }) => {
              return displayText === option.displayText
            })?.paramValue as string)
          )
        })

        // If nothing is selected toggle the default value (`[]`)
        if (next.length === 0) {
          next = ParamDefaultValues.locationCities
        }

        dispatch({
          type: "selectFilters",
          payload: {
            displayText: option.displayText,
            paramValue: next,
            paramName: option.paramName,
          },
        })

        return next
      })
    }
  }

  const filterOptions = LOCATION_OPTIONS.map((option) => {
    if (option.displayText === DEFAULT_OPTION.displayText) {
      return { ...option, paramValue: nextOptions.length === 0 }
    }

    return { ...option, paramValue: nextOptions.includes(option.paramValue as string) }
  })

  return (
    <MultiSelectOptionScreen
      filterHeaderText={FilterDisplayName.locationCities}
      filterOptions={filterOptions}
      onSelect={handleSelect}
      navigation={navigation}
    />
  )
}
