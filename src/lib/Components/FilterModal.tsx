import { ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans } from "@artsy/palette"
import {
  changedFiltersParams,
  filterArtworksParams,
  FilterDisplayName,
  FilterType,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import _ from "lodash"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import {
  AggregationName,
  Aggregations,
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "../utils/ArtworkFiltersStore"
import { ColorOption, ColorOptionsScreen } from "./ArtworkFilterOptions/ColorOptions"
import { colorHexMap } from "./ArtworkFilterOptions/ColorSwatch"
import { GalleryOptionsScreen } from "./ArtworkFilterOptions/GalleryOptions"
import { InstitutionOptionsScreen } from "./ArtworkFilterOptions/InstitutionOptions"
import { MediumOptionsScreen } from "./ArtworkFilterOptions/MediumOptions"
import { PriceRangeOptionsScreen } from "./ArtworkFilterOptions/PriceRangeOptions"
import { SizeOptionsScreen } from "./ArtworkFilterOptions/SizeOptions"
import { SortOptionsScreen } from "./ArtworkFilterOptions/SortOptions"
import { TimePeriodOptionsScreen } from "./ArtworkFilterOptions/TimePeriodOptions"
import { WaysToBuyOptionsScreen } from "./ArtworkFilterOptions/WaysToBuyOptions"
import { FancyModal } from "./FancyModal"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  exitModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
  id: string
  slug: string
  trackingScreenName: PageNames
  trackingOwnerEntity: OwnerEntityTypes
}

export const FilterModalNavigator: React.SFC<FilterModalProps> = props => {
  const tracking = useTracking()

  const {
    closeModal,
    exitModal,
    isFilterArtworksModalVisible,
    id,
    slug,
    trackingScreenName,
    trackingOwnerEntity,
  } = props
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const handleClosingModal = () => {
    dispatch({ type: "resetFilters" })
    closeModal?.()
  }

  const applyFilters = () => {
    dispatch({ type: "applyFilters" })
    exitModal?.()
  }

  const getApplyButtonCount = () => {
    const selectedFiltersSum = state.selectedFilters.length

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
            passProps: { closeModal, id, slug },
            title: "",
          }}
          style={{ flex: 1 }}
        />
        <ApplyButtonContainer>
          <ApplyButton
            disabled={!isApplyButtonEnabled}
            onPress={() => {
              const appliedFiltersParams = filterArtworksParams(state.appliedFilters)

              // TODO: Update to use cohesion
              tracking.trackEvent({
                context_screen: trackingScreenName,
                context_screen_owner_type: trackingOwnerEntity,
                context_screen_owner_id: id,
                context_screen_owner_slug: slug,
                current: appliedFiltersParams,
                changed: changedFiltersParams(appliedFiltersParams, state.selectedFilters),
                action_type: Schema.ActionTypes.ChangeFilterParams,
              })

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

type FilterScreen =
  | "sort"
  | "waysToBuy"
  | "medium"
  | "priceRange"
  | "majorPeriods"
  | "dimensionRange"
  | "color"
  | "gallery"
  | "institution"

export interface FilterDisplayConfig {
  filterType: FilterScreen
  displayText: string
  ScreenComponent: React.SFC<any>
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
  id: string
  slug: string
  trackingScreenName: PageNames
  trackingOwnerEntity: OwnerEntityTypes
}

export const FilterOptions: React.SFC<FilterOptionsProps> = props => {
  const tracking = useTracking()
  const { closeModal, navigator, id, slug, trackingScreenName, trackingOwnerEntity } = props

  const { dispatch, aggregations } = useContext(ArtworkFilterContext)

  const navigateToNextFilterScreen = (NextComponent: any /* STRICTNESS_MIGRATION */) => {
    navigator.push({
      component: NextComponent,
    })
  }

  const concreteAggregations = aggregations ?? []
  const aggregateFilterOptions: FilterDisplayConfig[] = _.compact(
    concreteAggregations.map(aggregation => {
      const filterOption = filterTypeFromAggregation(aggregation.slice)
      return filterOption ? filterOptionToDisplayConfigMap.get(filterOption) : null
    })
  )

  const staticFilterOptions: FilterDisplayConfig[] = [
    filterOptionToDisplayConfigMap.get("sort")!,
    filterOptionToDisplayConfigMap.get("waysToBuy")!,
  ]

  const filterScreenSort = (left: FilterDisplayConfig, right: FilterDisplayConfig): number => {
    const sortOrder = [
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
    const leftParam = left.filterType
    const rightParam = right.filterType
    if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
      return -1
    } else {
      return 1
    }
  }

  const filterOptions: FilterDisplayConfig[] = staticFilterOptions.concat(aggregateFilterOptions)
  const sortedFilterOptions = filterOptions.sort(filterScreenSort)

  const clearAllFilters = () => {
    dispatch({ type: "clearAll" })
  }

  const handleTappingCloseIcon = () => {
    closeModal()
  }

  const selectedOptions = useSelectedOptionsDisplay()
  const multiSelectedOptions = selectedOptions.filter(option => option.paramValue === true)

  const selectedOption = (filterType: FilterScreen) => {
    if (filterType === "waysToBuy") {
      if (multiSelectedOptions.length === 0) {
        return "All"
      }
      return multiSelectionDisplay()
    }
    return selectedOptions.find(option => option.filterType === filterType)?.displayText
  }

  const multiSelectionDisplay = (): string => {
    const displayTexts: string[] = []
    multiSelectedOptions.forEach((f: FilterData) => {
      displayTexts.push(f.displayText)
    })
    return displayTexts.join(", ")
  }

  return (
    <Flex flexGrow={1}>
      <FilterHeaderContainer flexDirection="row" justifyContent="space-between">
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <CloseIconContainer hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleTappingCloseIcon}>
            <CloseIcon fill="black100" />
          </CloseIconContainer>
        </Flex>
        <FilterHeader weight="medium" size="4" color="black100">
          Filter
        </FilterHeader>
        <ClearAllButton
          onPress={() => {
            tracking.trackEvent({
              action_name: "clearFilters",
              context_screen: trackingScreenName,
              context_screen_owner_type: trackingOwnerEntity,
              context_screen_owner_id: id,
              context_screen_owner_slug: slug,
              action_type: Schema.ActionTypes.Tap,
            })

            clearAllFilters()
          }}
        >
          <Sans mr={2} mt={2} size="4" color="black100">
            Clear all
          </Sans>
        </ClearAllButton>
      </FilterHeaderContainer>

      <Flex flexGrow={1}>
        <FlatList<FilterDisplayConfig>
          keyExtractor={(_item, index) => String(index)}
          data={sortedFilterOptions}
          renderItem={({ item }) => {
            return (
              <Box>
                <TouchableOptionListItemRow onPress={() => navigateToNextFilterScreen(item.ScreenComponent)}>
                  <OptionListItem>
                    <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
                      <Sans size="3t" color="black100">
                        {item.displayText}
                      </Sans>
                      <Flex flexDirection="row">
                        <OptionDetail currentOption={selectedOption(item.filterType)} filterType={item.filterType} />
                        <ArrowRightIcon fill="black30" ml={0.3} mt={0.3} />
                      </Flex>
                    </Flex>
                  </OptionListItem>
                </TouchableOptionListItemRow>
              </Box>
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

const OptionDetail: React.FC<{ currentOption: any; filterType: any }> = ({ currentOption, filterType }) => {
  if (filterType === FilterType.color && currentOption !== "All") {
    return <ColorSwatch colorOption={currentOption} />
  } else {
    return <CurrentOption size="3t">{currentOption}</CurrentOption>
  }
}

const ColorSwatch: React.FC<{ colorOption: ColorOption }> = ({ colorOption }) => {
  return (
    <Box
      mt={0.3}
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

const FilterHeaderContainer = styled(Flex)`
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
`

export const FilterHeader = styled(Sans)`
  margin-top: 20px;
  padding-left: 35px;
`

export const FilterArtworkButtonContainer = styled(Flex)`
  position: absolute;
  bottom: 50;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

export const FilterArtworkButton = styled(Button)`
  border-radius: 100;
  width: 110px;
`

export const TouchableOptionListItemRow = styled(TouchableOpacity)``

export const CloseIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-top-width: 0;
  border-left-width: 0;
`

export const CurrentOption = styled(Sans)`
  color: ${color("black60")};
`
export const ClearAllButton = styled(TouchableOpacity)``
export const ApplyButton = styled(Button)``
export const ApplyButtonContainer = styled(Box)`
  padding: 20px;
  padding-bottom: 30px;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
`

const filterTypeFromAggregation = (name: AggregationName): FilterType | undefined => {
  const aggregationToFilterTypeMap: Map<AggregationName, FilterType> = new Map([
    ["COLOR", FilterType.color],
    ["DIMENSION_RANGE", FilterType.size],
    ["GALLERY", FilterType.gallery],
    ["INSTITUTION", FilterType.institution],
    ["MAJOR_PERIOD", FilterType.timePeriod],
    ["MEDIUM", FilterType.medium],
    ["PRICE_RANGE", FilterType.priceRange],
  ])
  return aggregationToFilterTypeMap.get(name)
}

export const aggregationNameFromFilterType = (filterType: FilterType): AggregationName | undefined => {
  const filterTypeToAggregationMap: Map<FilterType, AggregationName> = new Map([
    [FilterType.color, "COLOR"],
    [FilterType.size, "DIMENSION_RANGE"],
    [FilterType.gallery, "GALLERY"],
    [FilterType.institution, "INSTITUTION"],
    [FilterType.timePeriod, "MAJOR_PERIOD"],
    [FilterType.medium, "MEDIUM"],
    [FilterType.priceRange, "PRICE_RANGE"],
  ])
  return filterTypeToAggregationMap.get(filterType)
}

export const aggregationForFilterType = (type: FilterType, aggregations: Aggregations) => {
  const aggregationName = aggregationNameFromFilterType(type)
  const aggregation = aggregations!.filter(value => value.slice === aggregationName)[0]
  return aggregation
}

const filterOptionToDisplayConfigMap: Map<FilterType | FilterScreen, FilterDisplayConfig> = new Map([
  [
    "sort",
    {
      displayText: FilterDisplayName.sort,
      filterType: "sort",
      ScreenComponent: SortOptionsScreen,
    },
  ],
  [
    "medium",
    {
      displayText: FilterDisplayName.medium,
      filterType: "medium",
      ScreenComponent: MediumOptionsScreen,
    },
  ],
  [
    "priceRange",
    {
      displayText: FilterDisplayName.priceRange,
      filterType: "priceRange",
      ScreenComponent: PriceRangeOptionsScreen,
    },
  ],
  [
    "waysToBuy",
    {
      displayText: FilterDisplayName.waysToBuy,
      filterType: "waysToBuy",
      ScreenComponent: WaysToBuyOptionsScreen,
    },
  ],
  [
    "dimensionRange",
    {
      displayText: FilterDisplayName.size,
      filterType: "dimensionRange",
      ScreenComponent: SizeOptionsScreen,
    },
  ],
  [
    "color",
    {
      displayText: FilterDisplayName.color,
      filterType: "color",
      ScreenComponent: ColorOptionsScreen,
    },
  ],
  [
    "majorPeriods",
    {
      displayText: FilterDisplayName.timePeriod,
      filterType: "majorPeriods",
      ScreenComponent: TimePeriodOptionsScreen,
    },
  ],
  [
    "institution",
    {
      displayText: FilterDisplayName.institution,
      filterType: "institution",
      ScreenComponent: InstitutionOptionsScreen,
    },
  ],
  [
    "gallery",
    {
      displayText: FilterDisplayName.gallery,
      filterType: "gallery",
      ScreenComponent: GalleryOptionsScreen,
    },
  ],
])
