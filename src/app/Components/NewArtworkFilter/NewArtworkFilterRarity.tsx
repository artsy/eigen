import { Flex, Pill, Spacer, Text } from "@artsy/palette-mobile"
import { NewArtworksFiltersStore } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import {
  NewFilterData,
  NewFilterParamName,
  isFilterSelected,
  useSelectedFiltersByParamName,
} from "app/Components/NewArtworkFilter/helpers"
import { debounce } from "lodash"

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
            <Pill
              key={option.paramValue.value}
              accessibilityLabel={option.paramValue.displayLabel}
              mt={1}
              mr={1}
              selected={isFilterSelected(selectedFilters, option.paramValue)}
              onPress={debounce(() => {
                handlePress(option.paramValue)
              }, 200)}
            >
              {option.paramValue.displayLabel}
            </Pill>
          )
        })}
      </Flex>
    </Flex>
  )
}

export const ATTRIBUTION_CLASS_OPTIONS: Omit<NewFilterData, "paramName">[] = [
  {
    paramValue: {
      value: "unique",
      displayLabel: "Unique",
    },
  },
  {
    paramValue: {
      value: "limited edition",
      displayLabel: "Limited Edition",
    },
  },
  {
    paramValue: {
      value: "open edition",
      displayLabel: "Open Edition",
    },
  },
  {
    paramValue: {
      value: "unknown edition",
      displayLabel: "Unknown Edition",
    },
  },
]
