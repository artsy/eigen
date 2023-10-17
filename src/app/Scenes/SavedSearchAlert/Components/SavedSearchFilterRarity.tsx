import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { KNOWN_ATTRIBUTION_CLASS_OPTIONS } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"

export const SavedSearchFilterRarity = () => {
  const selectedAttributes = useSearchCriteriaAttributes(
    SearchCriteria.attributionClass
  ) as string[]

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
        key: SearchCriteria.attributionClass,
        value: value,
      })
    } else {
      const newValues = (selectedAttributes || []).concat(value)
      setValueToAttributesByKeyAction({
        key: SearchCriteria.attributionClass,
        value: newValues,
      })
    }
  }

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Rarity
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" flexWrap="wrap">
        {KNOWN_ATTRIBUTION_CLASS_OPTIONS.map((option) => {
          return (
            <SavedSearchFilterPill
              key={option.paramValue as string}
              accessibilityLabel={option.displayText}
              selected={isValueSelected({
                selectedAttributes,
                value: option.paramValue,
              })}
              onPress={() => {
                handlePress(option.paramValue as string)
              }}
            >
              {option.displayText}
            </SavedSearchFilterPill>
          )
        })}
      </Flex>
    </Flex>
  )
}
