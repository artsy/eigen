import { StackScreenProps } from "@react-navigation/stack"
import { themeGet } from "@styled-system/theme-get"
import {
  FilterDisplayName,
  filterKeyFromAggregation,
  FilterParamName,
  getSelectedFiltersCounts,
  getUnitedSelectedAndAppliedFilters,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersModel,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import _ from "lodash"
import { FilterIcon, Flex, Sans } from "palette"
import React, { useMemo } from "react"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { FilterConfigTypes } from "."
import { AnimatableHeader } from "../AnimatableHeader/AnimatableHeader"
import { AnimatableHeaderFlatList } from "../AnimatableHeader/AnimatableHeaderFlatList"
import { AnimatableHeaderProvider } from "../AnimatableHeader/AnimatableHeaderProvider"
import { AnimatedBottomButton } from "../AnimatedBottomButton"
import { ArtworkFilterNavigationStack } from "./ArtworkFilterNavigator"
import { ArtworkFilterOptionCheckboxItem } from "./components/ArtworkFilterOptionCheckboxItem"
import { ArtworkFilterOptionItem } from "./components/ArtworkFilterOptionItem"
import { FilterDisplayConfig, FilterScreen } from "./types"

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
}

export const ArtworkFilterOptionsScreen: React.FC<
  StackScreenProps<ArtworkFilterNavigationStack, "FilterOptionsScreen">
> = ({ navigation, route }) => {
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

  const selectedFiltersCounts = useMemo(() => {
    const unitedFilters = getUnitedSelectedAndAppliedFilters({
      filterType: filterTypeState,
      selectedFilters: selectedFiltersState,
      previouslyAppliedFilters: previouslyAppliedFiltersState,
    })
    const counts = getSelectedFiltersCounts(unitedFilters)
    return counts
  }, [filterTypeState, selectedFiltersState, previouslyAppliedFiltersState])

  const navigateToNextFilterScreen = (screenName: keyof ArtworkFilterNavigationStack) => {
    navigation.navigate(screenName)
  }

  const concreteAggregations = aggregationsState ?? []

  const isClearAllButtonEnabled = appliedFiltersState.length > 0 || selectedFiltersState.length > 0

  const aggregateFilterOptions: FilterDisplayConfig[] = _.compact(
    concreteAggregations.map((aggregation) => {
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
                  navigateToNextFilterScreen(item.ScreenComponent)
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
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.viewAs,
        filterOptionToDisplayConfigMap.estimateRange,
      ]

    case FilterModalMode.AuctionResults:
      return [
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.categories,
        filterOptionToDisplayConfigMap.sizes,
        filterOptionToDisplayConfigMap.year,
        filterOptionToDisplayConfigMap.organizations,
      ]

    case FilterModalMode.Custom:
      return customFilterOptions!

    default:
      return [
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.waysToBuy,
        filterOptionToDisplayConfigMap.attributionClass,
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
  background-color: ${themeGet("colors.black100")};
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

  const roundedButtonStyle = { borderRadius: 20 }

  return (
    <AnimatedBottomButton isVisible={isVisible} onPress={onPress} buttonStyles={roundedButtonStyle}>
      <FilterArtworkButton px="2" style={roundedButtonStyle}>
        <FilterIcon fill="white100" />
        <Sans size="3t" pl="1" py="1" color="white100" weight="medium">
          {text}
        </Sans>
        {getFiltersCount() > 0 && (
          <>
            <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
              {"\u2022"}
            </Sans>
            <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
              {getFiltersCount()}
            </Sans>
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
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const ArtistArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "attributionClass",
  "medium",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const ArtistSeriesFiltersSorted: FilterScreen[] = [
  "sort",
  "attributionClass",
  "medium",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const ArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const FairFiltersSorted: FilterScreen[] = [
  "partnerIDs",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
]
const SaleArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "viewAs",
  "artistIDs",
  "medium",
  "additionalGeneIDs",
  "estimateRange",
]

const ShowFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "artistNationalities",
  "majorPeriods",
  "colors",
]

const PartnerFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "artistNationalities",
  "majorPeriods",
  "colors",
]

const TagAndGeneFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "attributionClass",
  "additionalGeneIDs",
  "priceRange",
  "sizes",
  "waysToBuy",
  "materialsTerms",
  "artistNationalities",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]

const AuctionResultsFiltersSorted: FilterScreen[] = [
  "sort",
  "categories",
  "sizes",
  "year",
  "organizations",
]
