import { StackScreenProps } from "@react-navigation/stack"
import {
  FilterDisplayName,
  filterKeyFromAggregation,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { selectedOption } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { TouchableRow } from "lib/Components/TouchableRow"
import { Schema } from "lib/utils/track"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import _ from "lodash"
import { ArrowRightIcon, CloseIcon, color, FilterIcon, Flex, Sans, Separator, space, Text } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { AnimatedBottomButton } from "../AnimatedBottomButton"
import { ArtworkFilterNavigationStack } from "./ArtworkFilter"

export type FilterScreen =
  | "additionalGeneIDs"
  | "artistIDs"
  | "artistNationalities"
  | "artistsIFollow"
  | "attributionClass"
  | "categories"
  | "color"
  | "colors"
  | "dimensionRange"
  | "estimateRange"
  | "locationCities"
  | "majorPeriods"
  | "materialsTerms"
  | "medium"
  | "partnerIDs"
  | "priceRange"
  | "organizations"
  | "sizes"
  | "sort"
  | "viewAs"
  | "waysToBuy"
  | "year"

export interface FilterDisplayConfig {
  filterType: FilterScreen
  displayText: string
  ScreenComponent: keyof ArtworkFilterNavigationStack
}

export enum FilterModalMode {
  ArtistArtworks = "ArtistArtworks",
  ArtistSeries = "ArtistSeries",
  AuctionResults = "AuctionResults",
  Collection = "Collection",
  Fair = "Fair",
  Partner = "Partner",
  SaleArtworks = "SaleArtworks",
  Show = "Show",
  Category = "Category"
}

export const ArtworkFilterOptionsScreen: React.FC<
  StackScreenProps<ArtworkFilterNavigationStack, "FilterOptionsScreen">
> = ({ navigation, route }) => {
  const tracking = useTracking()
  const { closeModal, id, mode, slug, title = "Sort & Filter" } = route.params

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const aggregationsState = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const clearFiltersZeroStateAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.clearFiltersZeroStateAction
  )

  const selectedOptions = useSelectedOptionsDisplay()

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

  const filterOptions: FilterDisplayConfig[] = getStaticFilterOptionsByMode(mode).concat(aggregateFilterOptions)

  const sortedFilterOptions = filterOptions
    .sort(getFilterScreenSortByMode(mode))
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

  return (
    <Flex style={{ flex: 1 }}>
      <Flex flexGrow={0} flexDirection="row" justifyContent="space-between" alignItems="center" height={space(6)}>
        <Flex flex={1} alignItems="center">
          <Text variant="mediumText">{title}</Text>
        </Flex>

        <Flex position="absolute" alignItems="flex-start">
          <CloseIconContainer hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleTappingCloseIcon}>
            <CloseIcon fill="black100" />
          </CloseIconContainer>
        </Flex>

        <Flex position="absolute" right={0} alignItems="flex-end">
          <ClearAllButton
            disabled={!isClearAllButtonEnabled}
            onPress={() => {
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
              }

              clearAllFilters()
            }}
          >
            <Text variant="text" color={isClearAllButtonEnabled ? "black100" : "black30"}>
              Clear all
            </Text>
          </ClearAllButton>
        </Flex>
      </Flex>

      <Separator />

      <FlatList<FilterDisplayConfig>
        keyExtractor={(_item, index) => String(index)}
        data={sortedFilterOptions}
        style={{ flexGrow: 1 }}
        renderItem={({ item }) => {
          const selectedCurrentOption = selectedOption({
            selectedOptions,
            filterScreen: item.filterType,
            filterType: filterTypeState,
            aggregations: aggregationsState,
          })

          const currentOption =
            selectedCurrentOption === "All" || selectedCurrentOption === "Default" ? null : selectedCurrentOption

          return (
            <TouchableRow onPress={() => navigateToNextFilterScreen(item.ScreenComponent)}>
              <OptionListItem>
                <Flex p={2} pr={1.5} flexDirection="row" justifyContent="space-between" flexGrow={1}>
                  <Flex flex={1}>
                    <Text variant="caption">{item.displayText}</Text>
                  </Flex>

                  <Flex flexDirection="row" alignItems="center" justifyContent="flex-end" flex={1}>
                    <Flex flex={1} flexDirection="row" justifyContent="flex-end">
                      <CurrentOption variant="caption" color="black60" ellipsizeMode="tail" numberOfLines={1}>
                        {currentOption}
                      </CurrentOption>
                    </Flex>

                    <ArrowRightIcon fill="black30" ml="1" />
                  </Flex>
                </Flex>
              </OptionListItem>
            </TouchableRow>
          )
        }}
      />
    </Flex>
  )
}

export const getStaticFilterOptionsByMode = (mode: FilterModalMode) => {
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

    case FilterModalMode.Category:
      return [
        filterOptionToDisplayConfigMap.sort,
      ]

    default:
      return [
        filterOptionToDisplayConfigMap.sort,
        filterOptionToDisplayConfigMap.waysToBuy,
        filterOptionToDisplayConfigMap.attributionClass,
      ]
  }
}

export const getFilterScreenSortByMode = (mode: FilterModalMode) => (
  left: FilterDisplayConfig,
  right: FilterDisplayConfig
): number => {
  let sortOrder: FilterScreen[] = []

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
    case FilterModalMode.Show:
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
      sortOrder = [
        "sort",
        "medium",
        "additionalGeneIDs",
        "materialsTerms",
        "priceRange",
        "attributionClass",
        "dimensionRange",
        "waysToBuy",
        "artistNationalities",
        "majorPeriods",
        "colors",
      ]
      break
    case FilterModalMode.Category:
      sortOrder = [
        "sort",
        "medium",
        "additionalGeneIDs",
        "priceRange",
      ]
      break
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
  background-color: ${color("black100")};
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
      const hasArtistIDs = !!appliedFiltersState.find((filter) => filter.paramName === FilterParamName.artistIDs)

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

export const CloseIconContainer = styled(TouchableOpacity)`
  padding: ${space(2)}px;
`

export const ClearAllButton = styled(TouchableOpacity)`
  padding: ${space(2)}px;
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export const CurrentOption = styled(Text)``

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
  dimensionRange: {
    displayText: FilterDisplayName.size,
    filterType: "dimensionRange",
    ScreenComponent: "SizeOptionsScreen",
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
  "medium",
  "additionalGeneIDs",
  "materialsTerms",
  "priceRange",
  "attributionClass",
  "dimensionRange",
  "waysToBuy",
  "locationCities",
  "artistNationalities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const ArtistArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "medium",
  "additionalGeneIDs",
  "materialsTerms",
  "priceRange",
  "attributionClass",
  "dimensionRange",
  "waysToBuy",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const ArtistSeriesFiltersSorted: FilterScreen[] = [
  "sort",
  "medium",
  "additionalGeneIDs",
  "materialsTerms",
  "priceRange",
  "attributionClass",
  "dimensionRange",
  "waysToBuy",
  "locationCities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const FairFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "artistsIFollow",
  "medium",
  "additionalGeneIDs",
  "materialsTerms",
  "priceRange",
  "attributionClass",
  "dimensionRange",
  "waysToBuy",
  "locationCities",
  "artistNationalities",
  "majorPeriods",
  "colors",
  "partnerIDs",
]
const SaleArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "viewAs",
  "artistIDs",
  "medium",
  "additionalGeneIDs",
  "estimateRange",
]

const AuctionResultsFiltersSorted: FilterScreen[] = ["sort", "categories", "sizes", "year", "organizations"]
