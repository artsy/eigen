import { FilterData, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  DEFAULT_FILTERS,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { compact, every, isString } from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

// Default value is always empty array since this is a multi-select
const DEFAULT_VALUE: string[] = []

export const useMultiSelect = ({
  options,
  paramName,
}: {
  options: FilterData[]
  paramName: FilterParamName
}) => {
  const defaultFilter = DEFAULT_FILTERS.find((option) => option.paramName === paramName)

  const didMountRef = useRef(false)

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedParamOptions = selectedOptions.find((option) => {
    return option.paramName === paramName
  })

  // Array of selected paramValues: the value that's actually dispatched
  const [nextParamValues, setNextParamValues] = useState<string[]>(
    typeof selectedParamOptions?.paramValue === "object" &&
      every(selectedParamOptions.paramValue, isString)
      ? selectedParamOptions.paramValue
      : []
  )

  // Array of selected options
  const nextOptions = useMemo(
    () =>
      compact(
        nextParamValues.map((paramValue) => {
          return options.find((option) => option.paramValue === paramValue)
        })
      ),
    [nextParamValues, options]
  )

  const getParamValue = (option: FilterData) => {
    // (property) FilterData.paramValue?: string | number | boolean | string[] | undefined
    switch (typeof option.paramValue) {
      case "undefined":
      case "boolean":
      case "object": // string[]
        // For dealing with things like our MultiSelectOptionScreen which
        // requires options with boolean paramValues:
        // Find the string paramValue within options using the displayText
        return String(
          options.find(({ displayText }) => {
            return displayText === option.displayText
          })!.paramValue
        )

      case "string":
      case "number":
        return String(option.paramValue)
    }
  }

  const handleSelect = useCallback(
    (option: FilterData, updatedValue: boolean) => {
      if (updatedValue) {
        // Append the paramValue
        setNextParamValues((prev) => {
          return [...prev, getParamValue(option)]
        })
      } else {
        // Remove the paramValue
        setNextParamValues((prev) => {
          return prev.filter((value) => {
            return value !== getParamValue(option)
          })
        })
      }
    },
    [getParamValue]
  )

  const isSelected = (option: FilterData) => {
    return nextParamValues.includes(getParamValue(option))
  }

  const handleClear = () => {
    setNextParamValues(DEFAULT_VALUE)
  }

  useEffect(() => {
    // Skips the initial mount
    if (didMountRef.current) {
      selectFiltersAction({
        paramName,
        // Label which appears on the filter overview screen
        displayText:
          nextOptions.map(({ displayText }) => displayText).join(", ") ||
          defaultFilter?.displayText ||
          "All",
        // Array of paramValues
        paramValue: nextParamValues,
      })
    }

    didMountRef.current = true
  }, [nextParamValues])

  const isActive = nextOptions.length > 0

  return {
    getParamValue,
    handleClear,
    handleSelect,
    isActive,
    isSelected,
    nextOptions,
    nextParamValues,
  }
}
