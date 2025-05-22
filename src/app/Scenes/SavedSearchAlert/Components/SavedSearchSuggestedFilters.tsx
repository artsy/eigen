import { ActionType, OwnerType, SelectedSuggestedFilter } from "@artsy/cohesion"
import {
  ChevronIcon,
  Flex,
  Skeleton,
  SkeletonBox,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SavedSearchSuggestedFiltersFetchQuery } from "__generated__/SavedSearchSuggestedFiltersFetchQuery.graphql"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { MenuItem } from "app/Components/MenuItem"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { isValueSelected, useSavedSearchFilter } from "app/Scenes/SavedSearchAlert/helpers"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

const SUPPORTED_SEARCH_CRITERIA = [
  SearchCriteria.additionalGeneIDs,
  SearchCriteria.attributionClass,
  SearchCriteria.priceRange,
  SearchCriteria.artistSeriesIDs,
]

export const SavedSearchSuggestedFilters: React.FC<{}> = () => {
  const tracking = useTracking()

  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()

  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const isEditFlow = !!SavedSearchStore.useStoreState((state) => state.currentAlertID)
  const currentArtworkID = SavedSearchStore.useStoreState((state) => state.currentArtworkID)

  const data = useLazyLoadQuery<SavedSearchSuggestedFiltersFetchQuery>(
    savedSearchSuggestedFiltersFetchQuery,
    {
      attributes: { artistIDs: attributes.artistIDs },
      source: currentArtworkID
        ? {
            type: "ARTWORK",
            id: currentArtworkID,
          }
        : undefined,
    }
  )

  const { handlePress: handleAttributionClassPress } = useSavedSearchFilter({
    criterion: SearchCriteria.attributionClass,
  })
  const { handlePress: handleAdditionalGeneIDsPress } = useSavedSearchFilter({
    criterion: SearchCriteria.additionalGeneIDs,
  })
  const { handlePress: handleArtistSeriesPress } = useSavedSearchFilter({
    criterion: SearchCriteria.artistSeriesIDs,
  })

  const { handlePress: handlePriceRangePress } = useSavedSearchFilter({
    criterion: SearchCriteria.priceRange,
  })

  const supportedSuggestedFitlers =
    data?.previewSavedSearch?.suggestedFilters.filter((filter) => {
      // Adding this check to make sure we don't add a filter type that's not
      // supported in the app
      return SUPPORTED_SEARCH_CRITERIA.indexOf(filter.field as SearchCriteria) > -1
    }) || []

  const suggestedFilters = supportedSuggestedFitlers.filter((filter) => {
    // Adding this check to make sure we don't add a filter type that's already
    // selected
    return !isValueSelected({
      selectedAttributes: attributes[filter.field as SearchCriteria] || [],
      value: filter.value,
    })
  })

  const handlePress = (field: SearchCriteria, value: string) => {
    switch (field) {
      // These are all array values
      case SearchCriteria.attributionClass:
        handleAttributionClassPress(value)
        break
      case SearchCriteria.additionalGeneIDs:
        handleAdditionalGeneIDsPress(value)
        break
      case SearchCriteria.artistSeriesIDs:
        handleArtistSeriesPress(value)
        break

      // These are all string values
      case SearchCriteria.priceRange:
        handlePriceRangePress(value)
        break

      default:
        break
    }
  }

  if (!supportedSuggestedFitlers.length) {
    return (
      <MenuItem
        title="Add Filters"
        description="Including Price Range, Rarity, Medium, Color"
        onPress={() => navigation.navigate("SavedSearchFilterScreen")}
        px={0}
      />
    )
  }

  return (
    <Flex mt={2}>
      <Text variant="sm-display">Add Filters</Text>

      <Flex flexDirection="row" flexWrap="wrap" mt={0.5} mx={-0.5} alignItems="center">
        {suggestedFilters.map((pill) => (
          <SavedSearchFilterPill
            key={pill.name + pill.value}
            m={0.5}
            accessibilityLabel={"Select " + pill.displayValue + " as a " + pill.name}
            selected={isValueSelected({
              selectedAttributes: attributes[pill.field as SearchCriteria] || [],
              value: pill.value,
            })}
            variant="dotted"
            onPress={() => {
              tracking.trackEvent(
                tracks.selectedSuggestedFilterTapped({
                  criterion: pill.field as SearchCriteria,
                  contextModule: isEditFlow ? OwnerType.editAlert : OwnerType.createAlert,
                })
              )
              handlePress(pill.field as SearchCriteria, pill.value)
            }}
          >
            {pill.displayValue}
          </SavedSearchFilterPill>
        ))}

        <MoreFiltersButton text="More Filters" />
      </Flex>
    </Flex>
  )
}

const MoreFiltersButton: React.FC<{ text: string }> = ({ text }) => {
  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()

  return (
    <Touchable
      onPress={() => {
        navigation.navigate("SavedSearchFilterScreen")
      }}
    >
      <Flex px={1} flexDirection="row" alignItems="center">
        <Text color="blue100" variant="xs">
          {text}
        </Text>
        <ChevronIcon
          height={14}
          width={14}
          direction="right"
          fill="blue100"
          ml={0.5}
          // More filters has no characters that extend below the baseline,
          // adding one pixel here for more visually appealing vertical centering that matches the design
          top="1px"
        />
      </Flex>
    </Touchable>
  )
}

export const SavedSearchSuggestedFiltersQueryRenderer = () => {
  return (
    <Suspense fallback={<SavedSearchSuggestedFiltersPlaceholder />}>
      <SavedSearchSuggestedFilters />
    </Suspense>
  )
}

export const SavedSearchSuggestedFiltersPlaceholder: React.FC = ({}) => {
  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()

  return (
    <Flex>
      <Touchable
        onPress={() => {
          navigation.navigate("SavedSearchFilterScreen")
        }}
      >
        <Text variant="sm-display">Add Filters</Text>
      </Touchable>

      <Spacer y={1} />

      <Skeleton>
        <Flex flexDirection="row">
          <SkeletonBox mr={1} mb={1} width={80} height={30} borderRadius={17} />
          <SkeletonBox mr={1} mb={1} width={120} height={30} borderRadius={17} />
          <SkeletonBox mr={1} mb={1} width={90} height={30} borderRadius={17} />
          <SkeletonBox mr={1} mb={1} width={140} height={30} borderRadius={17} />
        </Flex>
      </Skeleton>
    </Flex>
  )
}

const savedSearchSuggestedFiltersFetchQuery = graphql`
  query SavedSearchSuggestedFiltersFetchQuery(
    $attributes: PreviewSavedSearchAttributes!
    $source: AlertSource
  ) {
    previewSavedSearch(attributes: $attributes) @optionalField {
      suggestedFilters(source: $source) {
        displayValue
        field
        name
        value
      }
    }
  }
`

const tracks = {
  selectedSuggestedFilterTapped: ({
    criterion,
    contextModule,
  }: {
    criterion: SearchCriteria
    contextModule: OwnerType.createAlert | OwnerType.editAlert
  }): SelectedSuggestedFilter => {
    return {
      action: ActionType.selectedSuggestedFilter,
      context_module: contextModule,
      subject: criterion,
    }
  },
}
