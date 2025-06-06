import { Flex, useSpace } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { useLayout } from "app/utils/useLayout"
import { ColorsSwatch } from "./ColorsSwatch"
import { useMultiSelect } from "./useMultiSelect"

export const COLORS = [
  { value: "red", name: "Red", backgroundColor: "#BB392D" },
  { value: "orange", name: "Orange", backgroundColor: "#EA6B1F" },
  { value: "yellow", name: "Yellow", backgroundColor: "#E2B929" },
  { value: "green", name: "Green", backgroundColor: "#00674A" },
  { value: "blue", name: "Blue", backgroundColor: "#0A1AB4" },
  { value: "purple", name: "Purple", backgroundColor: "#7B3D91" },
  { value: "black-and-white", name: "Black and White", backgroundColor: "#000" },
  { value: "brown", name: "Brown", backgroundColor: "#7B5927" },
  { value: "gray", name: "Gray", backgroundColor: "#C2C2C2" },
  { value: "pink", name: "Pink", backgroundColor: "#E1ADCD" },
] as const

type Color = (typeof COLORS)[number]

export const COLORS_INDEXED_BY_VALUE = COLORS.reduce(
  (acc: Record<string, Color>, color) => ({ ...acc, [color.value]: color }),
  {}
)

export const COLOR_OPTIONS: FilterData[] = COLORS.map((color) => {
  return {
    // names returned by Metaphysics are actually the slugs
    displayText: color.name,
    paramValue: color.value,
    paramName: FilterParamName.colors,
  }
})

export const SWATCHES_PER_ROW = 4

type ColorsOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "ColorsOptionsScreen"
>

export const ColorsOptionsScreen: React.FC<ColorsOptionsScreenProps> = ({ navigation }) => {
  const space = useSpace()
  const { layout, handleLayout } = useLayout()

  const options: FilterData[] = COLOR_OPTIONS

  const { handleSelect, isSelected, handleClear, isActive } = useMultiSelect({
    options,
    paramName: FilterParamName.colors,
  })

  return (
    <Flex onLayout={handleLayout} flexGrow={1}>
      <ArtworkFilterBackHeader
        title={FilterDisplayName.colors}
        onLeftButtonPress={() => navigation.goBack()}
        {...(isActive ? { rightButtonText: "Clear", onRightButtonPress: handleClear } : {})}
      />

      <Flex p={1} flexWrap="wrap" flexDirection="row" justifyContent="flex-start">
        {options.map((option, i) => {
          const color = COLORS_INDEXED_BY_VALUE[String(option.paramValue)]
          const selected = isSelected(option)

          return (
            <ColorsSwatch
              key={i}
              width={(layout.width - space(1) * 2) / SWATCHES_PER_ROW}
              selected={selected}
              name={color.name}
              backgroundColor={color.backgroundColor}
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
