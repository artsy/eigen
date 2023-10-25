import { Flex, Pill, Text } from "@artsy/palette-mobile"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { MotiView } from "moti"

export const SavedSearchFilterAppliedFilters: React.FC<{}> = ({}) => {
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (state) => state.removeValueFromAttributesByKeyAction
  )

  const pills = useSavedSearchPills()

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight="bold">
        Your Filters
      </Text>

      <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
        {pills.map((pill) => (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 200 }}
            key={`${pill.paramName}-filter-label-${pill.value}`}
          >
            <Pill
              m={0.5}
              variant="filter"
              accessibilityLabel={pill.label}
              disabled={
                pill.paramName === SearchCriteria.artistID ||
                pill.paramName === SearchCriteria.artistIDs
              }
              onPress={() => {
                removeValueFromAttributesByKeyAction({
                  key: pill.paramName,
                  value: pill.value,
                })
              }}
            >
              {pill.label}
            </Pill>
          </MotiView>
        ))}
      </Flex>
    </Flex>
  )
}
