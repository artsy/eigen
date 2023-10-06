import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { FillPill } from "app/Components/NewArtworkFilter/NewArtworkFilterPill"
import { NewArtworksFiltersStore } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import {
  NewFilterData,
  NewFilterParamName,
  isFilterSelected,
  useSelectedFiltersByParamName,
} from "app/Components/NewArtworkFilter/helpers"

export const NewArtworkFilterRarity = () => {
  const selectedFilters = useSelectedFiltersByParamName(NewFilterParamName.attributionClass)

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
        Rarity
      </Text>
      <Spacer y={1} />
      <Flex flexDirection="row" flexWrap="wrap">
        {ATTRIBUTION_CLASS_OPTIONS.map((option) => {
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

export const ATTRIBUTION_CLASS_OPTIONS: NewFilterData["paramValue"][] = [
  {
    value: "unique",
    displayLabel: "Unique",
  },
  {
    value: "limited edition",
    displayLabel: "Limited Edition",
  },
  {
    value: "open edition",
    displayLabel: "Open Edition",
  },
  {
    value: "unknown edition",
    displayLabel: "Unknown Edition",
  },
]
