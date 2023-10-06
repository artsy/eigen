import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { FillPill } from "app/Components/NewArtworkFilter/NewArtworkFilterPill"
import { NewArtworksFiltersStore } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import {
  NewFilterData,
  NewFilterParamName,
  isFilterSelected,
  useSelectedFiltersByParamName,
} from "app/Components/NewArtworkFilter/helpers"

export const NewArtworkFilterCategories = () => {
  const selectedFilters = useSelectedFiltersByParamName(NewFilterParamName.categories)

  const selectFilterAction = NewArtworksFiltersStore.useStoreActions(
    (actions) => actions.selectFilterAction
  )
  const removeFilterAction = NewArtworksFiltersStore.useStoreActions(
    (actions) => actions.removeFilterAction
  )

  const handlePress = (value: Omit<NewFilterData, "paramName">["paramValue"]) => {
    const selectedFilterData = {
      paramName: NewFilterParamName.attributionClass,
      paramValue: value,
    }

    if (isFilterSelected(selectedFilters, value)) {
      removeFilterAction(selectedFilterData)
    } else {
      selectFilterAction(selectedFilterData)
    }
  }

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Medium
      </Text>
      <Spacer y={1} />
      <Flex flexDirection="row" flexWrap="wrap">
        {CATEGORIES_OPTIONS.map((option) => {
          return (
            <FillPill
              key={option.value}
              accessibilityLabel={option.displayLabel}
              selected={isFilterSelected(selectedFilters, option)}
              onPress={() => {
                handlePress(option)
              }}
            >
              {option.displayLabel}
            </FillPill>
          )
        })}
      </Flex>
    </Flex>
  )
}

export const CATEGORIES_OPTIONS: NewFilterData["paramValue"][] = [
  {
    displayLabel: "Print",
    value: "Print",
  },

  {
    displayLabel: "Photography",
    value: "Photography",
  },
  {
    displayLabel: "Work on Paper",
    value: "Work on Paper",
  },
  {
    displayLabel: "Ephemera or Merchandise",
    value: "Ephemera or Merchandise",
  },
  {
    displayLabel: "Painting",
    value: "Painting",
  },
  {
    displayLabel: "Drawing",
    value: "Drawing",
  },
  {
    displayLabel: "Sculpture",
    value: "Sculpture",
  },
]
