import { Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { KNOWN_ATTRIBUTION_CLASS_OPTIONS } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import {
  isValueSelected,
  useSavedSearchFilter,
  useSearchCriteriaAttributes,
} from "app/Scenes/SavedSearchAlert/helpers"

export const SavedSearchFilterRarity = () => {
  const { handlePress } = useSavedSearchFilter({ criterion: SearchCriteria.attributionClass })

  const selectedAttributes = useSearchCriteriaAttributes(
    SearchCriteria.attributionClass
  ) as string[]

  return (
    <Flex px={2}>
      <Separator my={2} borderColor="mono10" />
      <Text variant="sm" fontWeight="bold">
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
