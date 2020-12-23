import {
  AggregationName,
  ArtworkFilterContext,
  FilterArray,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import {
  changedFiltersParams,
  filterArtworksParams,
  FilterDisplayName,
  FilterParamName,
  FilterParams,
  selectedOption,
} from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import _ from "lodash"
import { ArrowRightIcon, Box, Button, CloseIcon, color, FilterIcon, Flex, Sans, Separator } from "palette"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { AnimatedBottomButton } from "../AnimatedBottomButton"
import { ArtistIDsOptionsScreen } from "../ArtworkFilterOptions/ArtistIDsOptionsScreen"
import { ColorOption, ColorOptionsScreen } from "../ArtworkFilterOptions/ColorOptions"
import { colorHexMap } from "../ArtworkFilterOptions/ColorSwatch"
import { EstimateRangeOptionsScreen } from "../ArtworkFilterOptions/EstimateRangeOptions"
import { GalleryOptionsScreen } from "../ArtworkFilterOptions/GalleryOptions"
import { InstitutionOptionsScreen } from "../ArtworkFilterOptions/InstitutionOptions"
import { MediumOptionsScreen } from "../ArtworkFilterOptions/MediumOptions"
import { PriceRangeOptionsScreen } from "../ArtworkFilterOptions/PriceRangeOptions"
import { SizeOptionsScreen } from "../ArtworkFilterOptions/SizeOptions"
import { SortOptionsScreen } from "../ArtworkFilterOptions/SortOptions"
import { TimePeriodOptionsScreen } from "../ArtworkFilterOptions/TimePeriodOptions"
import { ViewAsOptionsScreen } from "../ArtworkFilterOptions/ViewAsOptions"
import { WaysToBuyOptionsScreen } from "../ArtworkFilterOptions/WaysToBuyOptions"
import { FancyModal } from "../FancyModal/FancyModal"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  exitModal?: () => void
  navigator?: NavigatorIOS
  initiallyAppliedFilters?: FilterArray
  isFilterArtworksModalVisible: boolean
  id: string
  slug: string
  mode: FilterModalMode
}

export const FilterModalNavigator: React.FC<FilterModalProps> = (props) => {
  const tracking = useTracking()

  const { closeModal, exitModal, isFilterArtworksModalVisible, id, slug, mode } = props
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const handleClosingModal = () => {
    dispatch({ type: "resetFilters" })
    closeModal?.()
  }

  const applyFilters = () => {
    dispatch({ type: "applyFilters" })
    exitModal?.()
  }

  const trackChangeFilters = (
    screenName: PageNames,
    ownerEntity: OwnerEntityTypes,
    currentParams: FilterParams,
    changedParams: any
  ) => {
    tracking.trackEvent({
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      current: currentParams,
      changed: changedParams,
      action_type: Schema.ActionTypes.ChangeFilterParams,
    })
  }

  const getApplyButtonCount = () => {
    let selectedFiltersSum = state.selectedFilters.length

    // For Sale Artworks, the artistsIDs and the includeArtworksByFollowedArtists filters behave like one
    if (state.filterType === "saleArtwork") {
      const hasArtistsIFollow = !!state.selectedFilters.find(
        (filter) => filter.paramName === FilterParamName.artistsIFollow
      )
      const hasArtistIDs = !!state.selectedFilters.find((filter) => filter.paramName === FilterParamName.artistIDs)

      if (hasArtistIDs && hasArtistsIFollow) {
        --selectedFiltersSum
      }
    }
    return selectedFiltersSum > 0 ? `Apply (${selectedFiltersSum})` : "Apply"
  }

  const isApplyButtonEnabled =
    state.selectedFilters.length > 0 || (state.previouslyAppliedFilters.length === 0 && state.appliedFilters.length > 0)

  return (
    <FancyModal visible={isFilterArtworksModalVisible} onBackgroundPressed={handleClosingModal} maxHeight={550}>
      <View style={{ flex: 1 }}>
        <NavigatorIOS
          navigationBarHidden={true}
          initialRoute={{
            component: FilterOptions,
            passProps: { closeModal, id, slug, mode },
            title: "",
          }}
          style={{ flex: 1 }}
        />
        <Separator my={0} />
        <ApplyButtonContainer>
          <ApplyButton
            disabled={!isApplyButtonEnabled}
            onPress={() => {
              const appliedFiltersParams = filterArtworksParams(state.appliedFilters, state.filterType)
              // TODO: Update to use cohesion
              switch (mode) {
                case FilterModalMode.Collection:
                  trackChangeFilters(
                    PageNames.Collection,
                    OwnerEntityTypes.Collection,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
                case FilterModalMode.ArtistArtworks:
                  trackChangeFilters(
                    PageNames.ArtistPage,
                    OwnerEntityTypes.Artist,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
                case FilterModalMode.Fair:
                  trackChangeFilters(
                    PageNames.Fair2Page,
                    OwnerEntityTypes.Fair,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
                case FilterModalMode.SaleArtworks:
                  trackChangeFilters(
                    PageNames.Auction,
                    OwnerEntityTypes.Auction,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
                case FilterModalMode.Show:
                  trackChangeFilters(
                    PageNames.ShowPage,
                    OwnerEntityTypes.Show,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
              }
              applyFilters()
            }}
            block
            width={100}
            variant="primaryBlack"
            size="large"
          >
            {getApplyButtonCount()}
          </ApplyButton>
        </ApplyButtonContainer>
      </View>
    </FancyModal>
  )
}

export type FilterScreen =
  | "artistIDs"
  | "artistsIFollow"
  | "color"
  | "dimensionRange"
  | "estimateRange"
  | "gallery"
  | "institution"
  | "majorPeriods"
  | "medium"
  | "priceRange"
  | "sort"
  | "viewAs"
  | "waysToBuy"

export interface FilterDisplayConfig {
  filterType: FilterScreen
  displayText: string
  ScreenComponent: React.FC<any>
}

export enum FilterModalMode {
  ArtistArtworks = "ArtistArtworks",
  ArtistSeries = "ArtistSeries",
  Collection = "Collection",
  SaleArtworks = "SaleArtworks",
  Fair = "Fair",
  Show = "Show",
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
  id: string
  slug: string
  mode: FilterModalMode
}

export const FilterOptions: React.FC<FilterOptionsProps> = (props) => {
  const tracking = useTracking()
  const { closeModal, navigator, id, slug, mode } = props

  const { dispatch, state } = useContext(ArtworkFilterContext)

  const selectedOptions = useSelectedOptionsDisplay()

  const navigateToNextFilterScreen = (NextComponent: any /* STRICTNESS_MIGRATION */) => {
    navigator.push({
      component: NextComponent,
    })
  }

  const concreteAggregations = state.aggregations ?? []

  const isClearAllButtonEnabled = state.appliedFilters.length > 0 || state.selectedFilters.length > 0

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
    dispatch({ type: "clearAll" })
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
      <Flex flexGrow={0} flexDirection="row" justifyContent="space-between">
        <Flex position="absolute" width="100%" height={67} justifyContent="center" alignItems="center">
          <Sans size="4" weight="medium">
            Filter
          </Sans>
        </Flex>
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <CloseIconContainer hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleTappingCloseIcon}>
            <CloseIcon fill="black100" />
          </CloseIconContainer>
        </Flex>
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
                trackClear(PageNames.Fair2Page, OwnerEntityTypes.Fair)
                break
            }

            clearAllFilters()
          }}
        >
          <Sans mr={2} mt={2} size="4" color={isClearAllButtonEnabled ? "black100" : "black30"}>
            Clear all
          </Sans>
        </ClearAllButton>
      </Flex>
      <Separator />
      <FlatList<FilterDisplayConfig>
        keyExtractor={(_item, index) => String(index)}
        data={sortedFilterOptions}
        style={{ flexGrow: 1 }}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) => {
          return (
            <Box>
              <TouchableOptionListItemRow onPress={() => navigateToNextFilterScreen(item.ScreenComponent)}>
                <OptionListItem>
                  <Flex p={2} pr="15px" flexDirection="row" justifyContent="space-between" flexGrow={1}>
                    <Sans size="3t" color="black100">
                      {item.displayText}
                    </Sans>
                    <Flex flexDirection="row" alignItems="center">
                      <OptionDetail
                        currentOption={selectedOption({
                          selectedOptions,
                          filterScreen: item.filterType,
                          filterType: state.filterType,
                          aggregations: state.aggregations,
                        })}
                        filterType={item.filterType}
                      />
                      <ArrowRightIcon fill="black30" ml="1" />
                    </Flex>
                  </Flex>
                </OptionListItem>
              </TouchableOptionListItemRow>
            </Box>
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
        filterOptionToDisplayConfigMap.sortSaleArtworks,
        filterOptionToDisplayConfigMap.viewAs,
        filterOptionToDisplayConfigMap.estimateRange,
      ]

    default:
      return [filterOptionToDisplayConfigMap.sortArtworks, filterOptionToDisplayConfigMap.waysToBuy]
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
  }

  const leftParam = left.filterType
  const rightParam = right.filterType
  if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
    return -1
  } else {
    return 1
  }
}

const OptionDetail: React.FC<{ currentOption: any; filterType: any }> = ({ currentOption, filterType }) => {
  if (filterType === FilterParamName.color && currentOption !== "All") {
    return <ColorSwatch colorOption={currentOption} />
  } else {
    return <CurrentOption size="3t">{currentOption}</CurrentOption>
  }
}

const ColorSwatch: React.FC<{ colorOption: ColorOption }> = ({ colorOption }) => {
  return (
    <Box
      mr={0.3}
      style={{
        alignSelf: "center",
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: colorHexMap[colorOption],
      }}
    />
  )
}

export const FilterHeader = styled(Sans)`
  margin-top: 20px;
  padding-left: 35px;
`

export const FilterArtworkButton = styled(Flex)`
  background-color: ${color("black100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

export const AnimatedArtworkFilterButton: React.FC<{ isVisible: boolean; onPress: () => void }> = ({
  isVisible,
  onPress,
}) => {
  const { state } = useContext(ArtworkFilterContext)

  const getFiltersCount = () => {
    let selectedFiltersSum = state.appliedFilters.length

    // For Sale Artworks, the artistsIDs and the includeArtworksByFollowedArtists filters behave like one
    // Therefore we need to decrement the number of filters by one to give the user the impression they are one
    if (state.filterType === "saleArtwork") {
      const hasArtistsIFollow = !!state.appliedFilters.find(
        (filter) => filter.paramName === FilterParamName.artistsIFollow
      )
      const hasArtistIDs = !!state.appliedFilters.find((filter) => filter.paramName === FilterParamName.artistIDs)

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
          Sort & Filter
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

export const TouchableOptionListItemRow = styled(TouchableOpacity)``

export const CloseIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

export const CurrentOption = styled(Sans)`
  color: ${color("black60")};
`
export const ClearAllButton = styled(TouchableOpacity)``
export const ApplyButton = styled(Button)``
export const ApplyButtonContainer = styled(Box)`
  padding: 20px;
  padding-bottom: 30px;
`

const filterKeyFromAggregation: Record<AggregationName, FilterParamName | string | undefined> = {
  COLOR: FilterParamName.color,
  DIMENSION_RANGE: FilterParamName.size,
  GALLERY: "gallery",
  INSTITUTION: "institution",
  MAJOR_PERIOD: FilterParamName.timePeriod,
  MEDIUM: FilterParamName.medium,
  PRICE_RANGE: FilterParamName.priceRange,
  FOLLOWED_ARTISTS: "artistsIFollow",
  ARTIST: "artistIDs",
}

export const filterOptionToDisplayConfigMap: Record<string, FilterDisplayConfig> = {
  artistIDs: {
    displayText: FilterDisplayName.artistIDs,
    filterType: "artistIDs",
    ScreenComponent: ArtistIDsOptionsScreen,
  },
  color: {
    displayText: FilterDisplayName.color,
    filterType: "color",
    ScreenComponent: ColorOptionsScreen,
  },
  dimensionRange: {
    displayText: FilterDisplayName.size,
    filterType: "dimensionRange",
    ScreenComponent: SizeOptionsScreen,
  },
  estimateRange: {
    displayText: FilterDisplayName.estimateRange,
    filterType: "estimateRange",
    ScreenComponent: EstimateRangeOptionsScreen,
  },
  gallery: {
    displayText: FilterDisplayName.gallery,
    filterType: "gallery",
    ScreenComponent: GalleryOptionsScreen,
  },
  institution: {
    displayText: FilterDisplayName.institution,
    filterType: "institution",
    ScreenComponent: InstitutionOptionsScreen,
  },
  majorPeriods: {
    displayText: FilterDisplayName.timePeriod,
    filterType: "majorPeriods",
    ScreenComponent: TimePeriodOptionsScreen,
  },
  medium: {
    displayText: FilterDisplayName.medium,
    filterType: "medium",
    ScreenComponent: MediumOptionsScreen,
  },
  priceRange: {
    displayText: FilterDisplayName.priceRange,
    filterType: "priceRange",
    ScreenComponent: PriceRangeOptionsScreen,
  },
  sortArtworks: {
    displayText: FilterDisplayName.sort,
    filterType: "sort",
    ScreenComponent: SortOptionsScreen,
  },
  sortSaleArtworks: {
    displayText: FilterDisplayName.sort,
    filterType: "sort",
    ScreenComponent: SortOptionsScreen,
  },
  viewAs: {
    displayText: FilterDisplayName.viewAs,
    filterType: "viewAs",
    ScreenComponent: ViewAsOptionsScreen,
  },
  waysToBuy: {
    displayText: FilterDisplayName.waysToBuy,
    filterType: "waysToBuy",
    ScreenComponent: WaysToBuyOptionsScreen,
  },
}

const CollectionFiltersSorted: FilterScreen[] = [
  "sort",
  "medium",
  "priceRange",
  "waysToBuy",
  "dimensionRange",
  "majorPeriods",
  "color",
  "gallery",
  "institution",
]
const ArtistArtworksFiltersSorted: FilterScreen[] = [
  "sort",
  "medium",
  "priceRange",
  "waysToBuy",
  "gallery",
  "institution",
  "dimensionRange",
  "majorPeriods",
  "color",
]
const ArtistSeriesFiltersSorted: FilterScreen[] = [
  "sort",
  "medium",
  "priceRange",
  "waysToBuy",
  "dimensionRange",
  "majorPeriods",
  "color",
  "gallery",
  "institution",
]
const FairFiltersSorted: FilterScreen[] = [
  "sort",
  "artistIDs",
  "artistsIFollow",
  "medium",
  "priceRange",
  "waysToBuy",
  "dimensionRange",
  "majorPeriods",
  "color",
  "gallery",
  "institution",
]
const SaleArtworksFiltersSorted: FilterScreen[] = ["sort", "viewAs", "estimateRange", "artistIDs", "medium"]
