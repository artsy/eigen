import { Flex, Pill, Text } from "@artsy/palette-mobile"
import { NewArtworksFiltersStore } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { MotiView } from "moti"
import { useMemo } from "react"

export const NewArtworkFilterAppliedFilters: React.FC<{ includeArtistNames?: boolean }> = ({
  includeArtistNames = false,
}) => {
  const selectedFilters = NewArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const removeFilterAction = NewArtworksFiltersStore.useStoreActions(
    (state) => state.removeFilterAction
  )

  const entity = SavedSearchStore.useStoreState((state) => state.entity)

  const artistPills = useMemo(() => {
    return entity?.artists.map((artist) => ({
      paramName: NewFilterParamName.artistIDs,
      paramValue: {
        value: artist.id,
        displayLabel: artist.name,
      },
    }))
  }, [entity])

  const allPills = useMemo(() => {
    if (includeArtistNames) return [...artistPills, ...selectedFilters]
    else {
      return [...selectedFilters]
    }
  }, [selectedFilters, entity])

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Your Filters
      </Text>

      <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
        {/* TODO: Adapt useSavedSearchPills to work here with little coupling from saved searches */}
        {allPills.map((pill, index) => (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 200 }}
            key={`filter-label-${index}`}
          >
            <Pill
              testID={pill.paramValue.displayLabel}
              m={0.5}
              variant="filter"
              accessibilityLabel={pill.paramValue.displayLabel}
              disabled={pill.paramName === NewFilterParamName.artistIDs}
              onPress={() => {
                // Add remove
                removeFilterAction(pill)
              }}
            >
              {pill.paramValue.displayLabel}
            </Pill>
          </MotiView>
        ))}
      </Flex>
    </Flex>
  )
}
