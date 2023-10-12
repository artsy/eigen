import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { CATEGORIES_OPTIONS } from "app/Components/ArtworkFilter/Filters/CategoriesOptions"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"

export const SavedSearchFilterAdditionalGeneIDs = () => {
  const selectedAttributes = useSearchCriteriaAttributes(
    SearchCriteria.additionalGeneIDs
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
        key: SearchCriteria.additionalGeneIDs,
        value: value,
      })
    } else {
      const newValues = (selectedAttributes || []).concat(value)
      setValueToAttributesByKeyAction({
        key: SearchCriteria.additionalGeneIDs,
        value: newValues,
      })
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
