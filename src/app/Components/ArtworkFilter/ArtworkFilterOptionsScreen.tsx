import { FilterIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { themeGet } from "@styled-system/theme-get"
import { AnimatableHeader } from "app/Components/AnimatableHeader/AnimatableHeader"
import { AnimatableHeaderFlatList } from "app/Components/AnimatableHeader/AnimatableHeaderFlatList"
import { AnimatableHeaderProvider } from "app/Components/AnimatableHeader/AnimatableHeaderProvider"
import { AnimatedBottomButton } from "app/Components/AnimatedBottomButton"
import {
  FilterDisplayName,
  FilterParamName,
  filterKeyFromAggregation,
  getSelectedFiltersCounts,
  getUnitedSelectedAndAppliedFilters,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersModel,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { compact } from "lodash"
import React, { useMemo } from "react"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { ArtworkFilterNavigationStack } from "./ArtworkFilterNavigator"
import { ArtworkFilterOptionCheckboxItem } from "./components/ArtworkFilterOptionCheckboxItem"
import { ArtworkFilterOptionItem } from "./components/ArtworkFilterOptionItem"
import { FilterConfigTypes, FilterDisplayConfig, FilterScreen } from "./types"

export enum FilterModalMode {
  ArtistArtworks = "ArtistArtworks",
  ArtistSeries = "ArtistSeries",
  Artworks = "Artworks",
  AuctionResults = "AuctionResults",
  Collection = "Collection",
  Fair = "Fair",
  Partner = "Partner",
  SaleArtworks = "SaleArtworks",
  Show = "Show",
  Gene = "Gene",
  Tag = "Tag",
  Search = "Search",
  Custom = "Custom",
  Collect = "Collect",
}

export const ArtworkFilterOptionsScreen: React.FC<
  StackScreenProps<ArtworkFilterNavigationStack, "FilterOptionsScreen">
> = ({ navigation, route }) => {
  const enableArtistSeriesFilter = useFeatureFlag("AREnableArtistSeriesFilter")
  const enableAvailabilityFilter = useFeatureFlag("AREnableAvailabilityFilter")
  const enableFramedFilter = useFeatureFlag("AREnableFramedFilter")

  const tracking = useTracking()
  const { closeModal, id, mode, slug, title = "Sort & Filter" } = route.params

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const previouslyAppliedFiltersState = ArtworksFiltersStore.useStoreState(
    (state) => state.previouslyAppliedFilters
  )
  const selectedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const aggregationsState = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const localFilterOptions = ArtworksFiltersStore.useStoreState((s) => s.filterOptions)

  const clearFiltersZeroStateAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.clearFiltersZeroStateAction
  )

  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  const selectedFiltersCounts = useMemo(() => {
    const unitedFilters = getUnitedSelectedAndAppliedFilters({
      filterType: filterTypeState,
      selectedFilters: selectedFiltersState,
      previouslyAppliedFilters: previouslyAppliedFiltersState,
    })
    const counts = getSelectedFiltersCounts(unitedFilters)
    return counts
  }, [filterTypeState, selectedFiltersState, previouslyAppliedFiltersState])

  const navigateToSpecificFilterOptionScreen = (screenName: keyof ArtworkFilterNavigationStack) => {
    if (screenName !== "FilterOptionsScreen") {
      navigation.navigate(screenName)
    }
  }

  const concreteAggregations = aggregationsState ?? []

  const isClearAllButtonEnabled = appliedFiltersState.length > 0 || selectedFiltersState.length > 0

  const aggregateFilterOptions: FilterDisplayConfig[] = compact(
    concreteAggregations.map((aggregation) => {
      if (aggregation?.counts?.length === 0) {
        return null
      }

      const filterOption = filterKeyFromAggregation[aggregation.slice]
      return filterOption ? filterOptionToDisplayConfigMap[filterOption] : null
    })
  )

  const filterOptions: FilterDisplayConfig[] = getStaticFilterOptionsByMode(
    mode,
    localFilterOptions
  ).concat(aggregateFilterOptions)

  const sortedFilterOptions = filterOptions
    .sort(getFilterScreenSortByMode(mode, localFilterOptions))
    .filter((filterOption) => filterOption.filterType)
    // Filter out the Artist Series filter if the feature flag is disabled
    .filter(
      (filterOption) =>
        (enableArtistSeriesFilter || filterOption.filterType !== "artistSeriesIDs") &&
        (enableAvailabilityFilter || filterOption.filterType !== "availability") &&
        (enableFramedFilter || filterOption.filterType !== "framed")
    )

  const clearAllFilters = () => {
    clearFiltersZeroStateAction()
  }

  const trackClear = (screenName: PageNames, ownerEntity: OwnerEntityTypes) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const handleTappingCloseIcon = () => {
    dismiss("alert-finish")
    closeModal()
  }

  const handleClearAllPress = () => {
    switch (mode) {
      case FilterModalMode.Collection:
        trackClear(PageNames.Collection, OwnerEntityTypes.Collection)
        break
      case FilterModalMode.ArtistArtworks:
        trackClear(PageNames.ArtistPage, OwnerEntityTypes.Artist)
        break
      case FilterModalMode.ArtistSeries:
        trackClear(PageNames.ArtistSeriesPage, OwnerEntityTypes.ArtistSeries)
        break
      case "Fair":
        trackClear(PageNames.FairPage, OwnerEntityTypes.Fair)
        break
      case FilterModalMode.Gene:
        trackClear(PageNames.GenePage, OwnerEntityTypes.Gene)
        break
      case FilterModalMode.Search:
        trackClear(PageNames.Search, OwnerEntityTypes.Search)
        break
    }

    clearAllFilters()
  }

  return (
    <AnimatableHeaderProvider>
      <Flex flex={1}>
        <AnimatableHeader
          title={title}
          rightButtonDisabled={!isClearAllButtonEnabled}
          onLeftButtonPress={handleTappingCloseIcon}
          onRightButtonPress={handleClearAllPress}
          rightButtonText="Clear All"
        />
        <AnimatableHeaderFlatList<FilterDisplayConfig>
          keyExtractor={(_item, index) => String(index)}
          data={sortedFilterOptions}
          style={{ flexGrow: 1 }}
          renderItem={({ item }) => {
            const selectedFiltersCount = selectedFiltersCounts[item.filterType as FilterParamName]
            if (item.configType === FilterConfigTypes.FilterScreenCheckboxItem) {
              return <ArtworkFilterOptionCheckboxItem item={item} />
            }
            return (
              <ArtworkFilterOptionItem
                item={item}
                count={selectedFiltersCount}
                onPress={() => {
                  navigateToSpecificFilterOptionScreen(
                    item.ScreenComponent as keyof ArtworkFilterNavigationStack
                  )
                }}
              />
            )
          }}
        />
      </Flex>
    </AnimatableHeaderProvider>
  )
}

export const getStaticFilterOptionsByMode = (
  mode: FilterModalMode,
  customFilterOptions: ArtworkFiltersModel["filterOptions"]
) => {
  switch (mode) {
    case FilterModalMode.SaleArtworks:
      return [
        filterOptionToDisplayConfigMap.colors,
        filterOptionToDisplayConfigMap.estimateRange,
        filterOptionToDisplayConfigMap.framed,
        filterOptionToDisplayConfigMap.priceRange,
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.viewAs,
      ]

    case FilterModalMode.AuctionResults:
      return [
        filterOptionToDisplayConfigMap.categories,
        filterOptionToDisplayConfigMap.colors,
        filterOptionToDisplayConfigMap.organizations,
        filterOptionToDisplayConfigMap.priceRange,
        filterOptionToDisplayConfigMap.sizes,
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.year,
      ]

    case FilterModalMode.Custom:
      return customFilterOptions || []

    default:
      return [
        filterOptionToDisplayConfigMap.attributionClass,
        filterOptionToDisplayConfigMap.availability,
        filterOptionToDisplayConfigMap.colors,
        filterOptionToDisplayConfigMap.framed,
        filterOptionToDisplayConfigMap.priceRange,
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.sizes,
        filterOptionToDisplayConfigMap.waysToBuy,
      ]
  }
}

export const getFilterScreenSortByMode =
  (mode: FilterModalMode, localFilterOptions: ArtworkFiltersModel["filterOptions"]) =>
  (left: FilterDisplayConfig, right: FilterDisplayConfig): number => {
    let sortOrder: Array<FilterDisplayConfig["filterType"]> = []

    // Filter order is based on frequency of use for a given page
    switch (mode) {
      case FilterModalMode.Collection:
        sortOrder = CollectionFiltersSorted
        break
      case FilterModalMode.ArtistArtworks:
        sortOrder = ArtistArtworksFiltersSorted
        break
      case FilterModalMode.ArtistSeries:
        sortOrder = ArtistSeriesFiltersSorted
        break
      case FilterModalMode.Artworks:
        sortOrder = ArtworksFiltersSorted
        break
      case FilterModalMode.Search:
        sortOrder = ArtworksFiltersSorted
        break
      case FilterModalMode.Show:
        sortOrder = ShowFiltersSorted
        break
      case FilterModalMode.Fair:
        sortOrder = FairFiltersSorted
        break
      case FilterModalMode.SaleArtworks:
        sortOrder = SaleArtworksFiltersSorted
        break
      case FilterModalMode.AuctionResults:
        sortOrder = AuctionResultsFiltersSorted
        break
      case FilterModalMode.Partner:
        sortOrder = PartnerFiltersSorted
        break
      case FilterModalMode.Gene:
        sortOrder = TagAndGeneFiltersSorted
        break
      case FilterModalMode.Tag:
        sortOrder = TagAndGeneFiltersSorted
        break
      case FilterModalMode.Custom:
        sortOrder = (localFilterOptions ?? []).map((f) => f.filterType)
        break
      case FilterModalMode.Collect:
        sortOrder = CollectFiltersSorted
        break
      default:
        assertNever(mode)
    }

    const leftParam = left.filterType
    const rightParam = right.filterType
    if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
      return -1
    } else {
      return 1
    }
  }

export const FilterArtworkButton = styled(Flex)`
  background-color: ${themeGet("colors.mono100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

interface AnimatedArtworkFilterButtonProps {
  isVisible: boolean
  onPress: () => void
  text?: string
}
export const AnimatedArtworkFilterButton: React.FC<AnimatedArtworkFilterButtonProps> = ({
  isVisible,
  onPress,
  text = "Sort & Filter",
}) => {
  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const getFiltersCount = () => {
    let selectedFiltersSum = appliedFiltersState.length

    // the earliest created year and the latest created year are different fileters but they behave as one
    // therefore we need to decrement the number of filters by one when they are active
    if (filterTypeState === "auctionResult") {
      const hasEarliestCreatedYearFilterEnabled = !!appliedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.earliestCreatedYear
      )
      const hasLatestCreatedYearFilterEnabled = !!appliedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.latestCreatedYear
      )

      if (hasEarliestCreatedYearFilterEnabled || hasLatestCreatedYearFilterEnabled) {
        --selectedFiltersSum
      }

      const hasFilteredUpcomingAuctionResults =
        appliedFiltersState.find((filter) => filter.paramName === FilterParamName.state)
          ?.paramValue === "ALL"

      if (hasFilteredUpcomingAuctionResults) {
        --selectedFiltersSum
      }
    }
    // For Sale Artworks, the artistsIDs and the includeArtworksByFollowedArtists filters behave like one
    // Therefore we need to decrement the number of filters by one to give the user the impression they are one
    if (filterTypeState === "saleArtwork") {
      const hasArtistsIFollow = !!appliedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.artistsIFollow
      )
      const hasArtistIDs = !!appliedFiltersState.find(
        (filter) => filter.paramName === FilterParamName.artistIDs
      )

      if (hasArtistIDs && hasArtistsIFollow) {
        --selectedFiltersSum
      }
    }
    return selectedFiltersSum
  }

  const roundedButtonStyle = {
    borderRadius: 50,
    marginBottom: 0,
  }

  return (
    <AnimatedBottomButton isVisible={isVisible} onPress={onPress} buttonStyles={roundedButtonStyle}>
      <FilterArtworkButton px={2} style={roundedButtonStyle}>
        <FilterIcon fill="mono0" />
        <Text variant="sm" pl={1} py={1} color="mono0" weight="medium">
          {text}
        </Text>
        {getFiltersCount() > 0 && (
          <>
            <Text variant="sm" pl={0.5} py={1} color="mono0" weight="medium">
              {"\u2022"}
            </Text>
            <Text variant="sm" pl={0.5} py={1} color="mono0" weight="medium">
              {getFiltersCount()}
            </Text>
          </>
        )}
      </FilterArtworkButton>
    </AnimatedBottomButton>
  )
}

export const filterOptionToDisplayConfigMap: Record<string, FilterDisplayConfig> = {
  additionalGeneIDs: {
    displayText: FilterDisplayName.additionalGeneIDs,
    filterType: "additionalGeneIDs",
    ScreenComponent: "AdditionalGeneIDsOptionsScreen",
  },
  artistIDs: {
    displayText: FilterDisplayName.artistIDs,
    filterType: "artistIDs",
    ScreenComponent: "ArtistIDsOptionsScreen",
  },
  artistNationalities: {
    displayText: FilterDisplayName.artistNationalities,
    filterType: "artistNationalities",
    ScreenComponent: "ArtistNationalitiesOptionsScreen",
  },
  artistSeriesIDs: {
    displayText: FilterDisplayName.artistSeriesIDs,
    filterType: "artistSeriesIDs",
    ScreenComponent: "ArtistSeriesOptionsScreen",
  },
  attributionClass: {
    displayText: FilterDisplayName.attributionClass,
    filterType: "attributionClass",
    ScreenComponent: "AttributionClassOptionsScreen",
  },
  colors: {
    displayText: FilterDisplayName.colors,
    filterType: "colors",
    ScreenComponent: "ColorsOptionsScreen",
  },
  categories: {
    displayText: FilterDisplayName.categories,
    filterType: "categories",
    ScreenComponent: "CategoriesOptionsScreen",
  },
  estimateRange: {
    displayText: FilterDisplayName.estimateRange,
    filterType: "estimateRange",
    ScreenComponent: "EstimateRangeOptionsScreen",
  },
  framed: {
    displayText: FilterDisplayName.framed,
    filterType: "framed",
    ScreenComponent: "FramedOptionsScreen",
  },
  availability: {
    displayText: FilterDisplayName.availability,
    filterType: "availability",
    ScreenComponent: "AvailabilityOptionsScreen",
  },
  partnerIDs: {
    displayText: FilterDisplayName.partnerIDs,
    filterType: "partnerIDs",
    ScreenComponent: "GalleriesAndInstitutionsOptionsScreen",
  },
  locationCities: {
    displayText: FilterDisplayName.locationCities,
    filterType: "locationCities",
    ScreenComponent: "LocationCitiesOptionsScreen",
  },
  majorPeriods: {
    displayText: FilterDisplayName.timePeriod,
    filterType: "majorPeriods",
    ScreenComponent: "TimePeriodOptionsScreen",
  },
  medium: {
    displayText: FilterDisplayName.medium,
    filterType: "medium",
    ScreenComponent: "MediumOptionsScreen",
  },
  organizations: {
    displayText: FilterDisplayName.organizations,
    filterType: "organizations",
    ScreenComponent: "AuctionHouseOptionsScreen",
  },
  priceRange: {
    displayText: FilterDisplayName.priceRange,
    filterType: "priceRange",
    ScreenComponent: "PriceRangeOptionsScreen",
  },
  sort: {
    displayText: FilterDisplayName.sort,
    filterType: "sort",
    ScreenComponent: "SortOptionsScreen",
  },
  sizes: {
    displayText: FilterDisplayName.sizes,
    filterType: "sizes",
    ScreenComponent: "SizesOptionsScreen",
  },
  state: {
    displayText: FilterDisplayName.state,
    filterType: "state",
    ScreenComponent: "none",
    configType: FilterConfigTypes.FilterScreenCheckboxItem,
  },
  viewAs: {
    displayText: FilterDisplayName.viewAs,
    filterType: "viewAs",
    ScreenComponent: "ViewAsOptionsScreen",
  },
  year: {
    displayText: FilterDisplayName.year,
    filterType: "year",
    ScreenComponent: "YearOptionsScreen",
  },
  waysToBuy: {
    displayText: FilterDisplayName.waysToBuy,
    filterType: "waysToBuy",
    ScreenComponent: "WaysToBuyOptionsScreen",
  },
  materialsTerms: {
    displayText: FilterDisplayName.materialsTerms,
    filterType: "materialsTerms",
    ScreenComponent: "MaterialsTermsOptionsScreen",
  },
}

const CollectionFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "medium",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
  "framed",
]
const ArtistArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "attributionClass",
  "medium",
  "additionalGeneIDs",
  "priceRange",
  "artistSeriesIDs",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
  "framed",
]
const ArtistSeriesFiltersSorted: FilterScreen[] = [
  "sort",
  "attributionClass",
  "medium",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
  "framed",
]
const ArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
  "framed",
]
const FairFiltersSorted: FilterScreen[] = [
  "partnerIDs",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "framed",
]
const SaleArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "viewAs",
  "artistIDs",
  "medium",
  "additionalGeneIDs",
  "estimateRange",
  "framed",
]

const ShowFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "majorPeriods",
  "colors",
  "framed",
]

const PartnerFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "majorPeriods",
  "colors",
  "framed",
]

const TagAndGeneFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
  "framed",
]

const AuctionResultsFiltersSorted: FilterScreen[] = [
  "sort",
  "categories",
  "sizes",
  "year",
  "organizations",
]

const CollectFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "availability",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
  "framed",
]
