import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { WAYS_TO_BUY_OPTIONS } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"

export const SavedSearchFilterWaysToBuy = () => {
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)

  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Ways to Buy
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" flexWrap="wrap">
        {WAYS_TO_BUY_OPTIONS.map((option, index) => {
          const criterion = option.paramName as unknown as SearchCriteria

          const isSelected = attributes[criterion]

          return (
            <SavedSearchFilterPill
              key={index}
              accessibilityLabel={option.displayText}
              selected={!!isSelected}
              onPress={() => {
                if (isSelected) {
                  removeValueFromAttributesByKeyAction({
                    key: criterion,
                    // The sent value doesn't matter, it's just to satisfy ts
                    value: false,
                  })
                } else {
                  setValueToAttributesByKeyAction({
                    key: criterion,
                    value: true,
                  })
                }
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
