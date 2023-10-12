import { Flex, Spacer, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import {
  COLORS_INDEXED_BY_VALUE,
  COLOR_OPTIONS,
  SWATCHES_PER_ROW,
} from "app/Components/ArtworkFilter/Filters/ColorsOptions"
import { ColorsSwatch } from "app/Components/ArtworkFilter/Filters/ColorsSwatch"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"

export const SavedSearchFilterColour = () => {
  const selectedAttributes = useSearchCriteriaAttributes(SearchCriteria.colors) as string[]

  const { width } = useScreenDimensions()
  const space = useSpace()

  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  const handlePress = (value: string) => {
    const isSelected = isValueSelected({
      selectedAttributes,
      value: value,
    })

    if (isSelected) {
      removeValueFromAttributesByKeyAction({
        key: SearchCriteria.colors,
        value: value,
      })
    } else {
      const newValues = (selectedAttributes || []).concat(value)
      setValueToAttributesByKeyAction({
        key: SearchCriteria.colors,
        value: newValues,
      })
    }
  }

  return (
    <Flex>
      <Text px={2} variant="sm" fontWeight={500}>
        Colour
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" flexWrap="wrap" px={1}>
        {COLOR_OPTIONS.map((option, i) => {
          const color = COLORS_INDEXED_BY_VALUE[String(option.paramValue)]

          return (
            <ColorsSwatch
              key={i}
              width={(width - space(1) * 2) / SWATCHES_PER_ROW}
              selected={isValueSelected({
                selectedAttributes,
                value: option.paramValue,
              })}
              name={color.name}
              backgroundColor={color.backgroundColor}
              foregroundColor={color.foregroundColor}
              onPress={() => {
                handlePress(option.paramValue as string)
              }}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}
