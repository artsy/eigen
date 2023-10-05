import { Flex, Pill, Text } from "@artsy/palette-mobile"
import { NewFilterData, NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"

export const NewArtworkFilterAppliedFilters: React.FC<{ includeArtistNames: boolean }> = ({
  includeArtistNames,
}) => {
  const entity = SavedSearchStore?.useStoreState((state) => state.entity)

  const activePills: NewFilterData[] = []

  if (entity && includeArtistNames) {
    entity.artists.forEach((artist) => {
      activePills.push({
        paramName: NewFilterParamName.artistIDs,
        paramValue: {
          value: artist.id,
          displayLabel: artist.name,
        },
      })
    })
  }

  activePills.push(...pillsData)

  return (
    <Flex px={2}>
      <Text variant="sm" fontWeight={500}>
        Your Filters
      </Text>

      <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
        {/* TODO: Adapt useSavedSearchPills to work here with little coupling from saved searches */}
        {activePills.map((pill, index) => (
          <Pill
            testID="alert-pill"
            m={0.5}
            variant="filter"
            accessibilityLabel={pill.paramValue.displayLabel}
            disabled={pill.paramName === NewFilterParamName.artistIDs}
            key={`filter-label-${index}`}
            // TODO: Implement onRemovePill
            // onPress={() => onRemovePill(pill)}
          >
            {pill.paramValue.displayLabel}
          </Pill>
        ))}
      </Flex>
    </Flex>
  )
}

const pillsData: NewFilterData[] = [
  {
    paramName: NewFilterParamName.categories,
    paramValue: {
      value: "painting",
      displayLabel: "Painting",
    },
  },
  {
    paramName: NewFilterParamName.attributionClass,
    paramValue: {
      value: "unique",
      displayLabel: "Unique",
    },
  },
]
