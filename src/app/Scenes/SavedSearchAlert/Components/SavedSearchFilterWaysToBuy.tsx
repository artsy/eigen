import { Flex, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { WAYS_TO_BUY_OPTIONS } from "app/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"

export const SavedSearchFilterWaysToBuy = () => {
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)

  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  return (
    <Flex px={2}>
      <Separator my={2} borderColor="mono10" />
      <Text variant="sm" fontWeight="bold">
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
                  addValueToAttributesByKeyAction({
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
