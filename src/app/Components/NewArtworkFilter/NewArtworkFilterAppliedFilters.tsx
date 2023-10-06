import { Flex, Pill, Text } from "@artsy/palette-mobile"
import { NewArtworksFiltersStore } from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useMemo } from "react"

export const NewArtworkFilterAppliedFilters: React.FC<{ includeArtistNames: boolean }> = ({
  includeArtistNames,
}) => {
  const selectedFilters = NewArtworksFiltersStore.useStoreState((state) => state.selectedFilters)

  const entity = SavedSearchStore?.useStoreState((state) => state.entity)

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
          <Pill
            testID="alert-pill"
            m={0.5}
            variant="filter"
            accessibilityLabel={pill.paramValue.displayLabel}
            disabled={pill.paramName === NewFilterParamName.artistIDs}
            key={`filter-label-${index}`}
            onPress={() => {
              // Add remove
            }}
          >
            {pill.paramValue.displayLabel}
          </Pill>
        ))}
      </Flex>
    </Flex>
  )
}
