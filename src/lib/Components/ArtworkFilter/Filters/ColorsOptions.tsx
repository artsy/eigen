import { StackScreenProps } from "@react-navigation/stack"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { useArtworkFiltersAggregation } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { useLayout } from "lib/utils/useLayout"
import { sortBy } from "lodash"
import { Flex, space } from "palette"
import React from "react"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ColorsSwatch } from "./ColorsSwatch"
import { useMultiSelect } from "./useMultiSelect"

const COLORS = [
  { value: "black-and-white", name: "Black and white", backgroundColor: "#000", foregroundColor: "#fff" },
  { value: "red", name: "Red", backgroundColor: "#FF0000", foregroundColor: "#fff" },
  { value: "yellow", name: "Yellow", backgroundColor: "#FBE854", foregroundColor: "#000" },
  { value: "pink", name: "Pink", backgroundColor: "#FB81CD", foregroundColor: "#000" },
  { value: "violet", name: "Violet", backgroundColor: "#B82C83", foregroundColor: "#fff" },
  { value: "gold", name: "Gold", backgroundColor: "#DAA520", foregroundColor: "#000" },
  { value: "orange", name: "Orange", backgroundColor: "#F7923A", foregroundColor: "#000" },
  { value: "darkviolet", name: "Dark violet", backgroundColor: "#642B7F", foregroundColor: "#fff" },
  { value: "lightgreen", name: "Light green", backgroundColor: "#BCCC46", foregroundColor: "#000" },
  { value: "lightblue", name: "Light blue", backgroundColor: "#C2D5F1", foregroundColor: "#000" },
  { value: "darkblue", name: "Dark blue", backgroundColor: "#0A1AB4", foregroundColor: "#fff" },
  { value: "darkorange", name: "Dark orange", backgroundColor: "#612A00", foregroundColor: "#fff" },
  { value: "darkgreen", name: "Dark green", backgroundColor: "#004600", foregroundColor: "#fff" },
] as const

type Color = typeof COLORS[number]

const COLORS_INDEXED_BY_VALUE = COLORS.reduce(
  (acc: Record<string, Color>, color) => ({ ...acc, [color.value]: color }),
  {}
)

const SWATCHES_PER_ROW = 4

interface ColorsOptionsScreenProps extends StackScreenProps<ArtworkFilterNavigationStack, "ColorsOptionsScreen"> {}

export const ColorsOptionsScreen: React.FC<ColorsOptionsScreenProps> = ({ navigation }) => {
  const { layout, handleLayout } = useLayout()

  // Pull out aggregations for 'color' not 'colors'
  const { aggregation } = useArtworkFiltersAggregation({
    paramName: FilterParamName.color,
  })

  // Convert aggregations to filter options
  const options: FilterData[] = (aggregation?.counts ?? []).map(({ value }) => {
    return {
      // names returned by Metaphysics are actually the slugs
      displayText: COLORS_INDEXED_BY_VALUE[value].name,
      paramValue: value,
      paramName: FilterParamName.colors,
    }
  })

  // Sort according to order of COLORS constant
  const sortedOptions = sortBy(options, (option) => {
    return COLORS.findIndex(({ value }) => value === option.paramValue)
  })

  const { handleSelect, isSelected } = useMultiSelect({ options, paramName: FilterParamName.colors })

  return (
    <Flex onLayout={handleLayout} flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={() => navigation.goBack()}>{FilterDisplayName.colors}</FancyModalHeader>

      <Flex p={1} flexWrap="wrap" flexDirection="row" justifyContent="flex-start">
        {sortedOptions.map((option, i) => {
          const color = COLORS_INDEXED_BY_VALUE[String(option.paramValue)]
          const selected = isSelected(option)

          return (
            <ColorsSwatch
              key={i}
              width={(layout.width - space(1) * 2) / SWATCHES_PER_ROW}
              selected={selected}
              name={color.name}
              backgroundColor={color.backgroundColor}
              foregroundColor={color.foregroundColor}
              onPress={() => {
                handleSelect(option, !selected)
              }}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}
