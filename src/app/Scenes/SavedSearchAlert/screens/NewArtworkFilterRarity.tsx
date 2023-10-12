import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ATTRIBUTION_CLASS_OPTIONS } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { FillPill } from "app/Components/NewArtworkFilter/NewArtworkFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"

export const AddFiltersScreenRarity = () => {
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
    if (
      isValueSelected({
        selectedAttributes,
        value: value,
      })
    ) {
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
        {ATTRIBUTION_CLASS_OPTIONS.map((option) => {
          return (
            <FillPill
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
            </FillPill>
          )
        })}
      </Flex>
    </Flex>
  )
}
