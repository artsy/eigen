import { ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans, space } from "@artsy/palette"
import {
  changedFiltersParams,
  ColorOption,
  filterArtworksParams,
  FilterOption,
  mapWaysToBuyTypesToFilterTypes,
  WaysToBuyOptions,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity, TouchableWithoutFeedback, ViewProperties } from "react-native"
import Modal from "react-native-modal"
import NavigatorIOS from "react-native-navigator-ios"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "../utils/ArtworkFiltersStore"
import { ColorOptionsScreen } from "./ArtworkFilterOptions/ColorOptions"
import { colorHexMap } from "./ArtworkFilterOptions/ColorSwatch"
import { MediumOptionsScreen } from "./ArtworkFilterOptions/MediumOptions"
import { PriceRangeOptionsScreen } from "./ArtworkFilterOptions/PriceRangeOptions"
import { SizeOptionsScreen } from "./ArtworkFilterOptions/SizeOptions"
import { SortOptionsScreen } from "./ArtworkFilterOptions/SortOptions"
import { TimePeriodOptionsScreen } from "./ArtworkFilterOptions/TimePeriodOptions"
import { WaysToBuyOptionsScreen } from "./ArtworkFilterOptions/WaysToBuyOptions"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  exitModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
  id: string
  slug: string
}

export const FilterModalNavigator: React.SFC<FilterModalProps> = props => {
  const tracking = useTracking()

  const { closeModal, exitModal, isFilterArtworksModalVisible, id, slug } = props
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
    <>
      {isFilterArtworksModalVisible && (
        <Modal isVisible={isFilterArtworksModalVisible} style={{ margin: 0 }}>
          <TouchableWithoutFeedback>
            <>
              <TouchableOpacity onPress={handleClosingModal} style={{ flexGrow: 1 }} />
              <ModalInnerView>
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

                      // TODO: Update tracking to account for artwork screen
                      tracking.trackEvent({
                        context_screen: Schema.ContextModules.Collection,
                        context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
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
              </ModalInnerView>
            </>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  )
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
  id: string
  slug: string
}

type FilterScreens = "sort" | "waysToBuy" | "medium" | "priceRange" | "majorPeriods" | "dimensionRange" | "color"

interface FilterOptions {
  filterType: FilterScreens
  filterText: string
  FilterScreenComponent: React.SFC<any>
}

interface MultiOptionFilterData {
  readonly value: boolean
  readonly filterType: MultiOptionFilterType
}

type MultiOptionFilterType = "waysToBuyBuy" | "waysToBuyBid" | "waysToBuyInquire" | "waysToBuyMakeOffer"

export const FilterOptions: React.SFC<FilterOptionsProps> = props => {
  const tracking = useTracking()
  const { closeModal, navigator, id, slug } = props

  const { dispatch } = useContext(ArtworkFilterContext)

  const navigateToNextFilterScreen = (NextComponent: any /* STRICTNESS_MIGRATION */) => {
    navigator.push({
      component: NextComponent,
    })
  }

  const filterOptions: FilterOptions[] = [
    {
      filterText: "Sort by",
      filterType: "sort",
      FilterScreenComponent: SortOptionsScreen,
    },
    {
      filterText: "Medium",
      filterType: "medium",
      FilterScreenComponent: MediumOptionsScreen,
    },
    {
      filterText: "Price range",
      filterType: "priceRange",
      FilterScreenComponent: PriceRangeOptionsScreen,
    },

    {
      filterText: "Ways to Buy",
      filterType: "waysToBuy",
      FilterScreenComponent: WaysToBuyOptionsScreen,
    },
    {
      filterText: "Size",
      filterType: "dimensionRange",
      FilterScreenComponent: SizeOptionsScreen,
    },
    {
      filterText: "Color",
      filterType: "color",
      FilterScreenComponent: ColorOptionsScreen,
    },
    {
      filterText: "Time Period",
      filterType: "majorPeriods",
      FilterScreenComponent: TimePeriodOptionsScreen,
    },
  ]

  const clearAllFilters = () => {
    dispatch({ type: "clearAll" })
  }

  const handleTappingCloseIcon = () => {
    closeModal()
  }

  const selectedOptions = useSelectedOptionsDisplay()
  const multiSelectedOption = selectedOptions.filter(option => option.value === true) as MultiOptionFilterData[]

  const selectedOption = (filterType: FilterScreens) => {
    if (filterType === "waysToBuy") {
      if (multiSelectedOption.length === 0) {
        return "All"
      }
      return multiSelectionDisplay()
    }
    return selectedOptions.find(option => option.filterType === filterType)?.value
  }

  const multiSelectionDisplay = (): WaysToBuyOptions => {
    const displayOptions: WaysToBuyOptions[] = []

    multiSelectedOption.forEach((f: MultiOptionFilterData) => {
      const displayOption = Object.keys(mapWaysToBuyTypesToFilterTypes).find(
        // @ts-ignore STRICTNESS_MIGRATION
        key => (mapWaysToBuyTypesToFilterTypes[key] as FilterOption) === f.filterType
      )

      displayOptions.push(displayOption as WaysToBuyOptions)
    })
    return displayOptions.join(", ") as WaysToBuyOptions
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
              context_screen: Schema.ContextModules.Collection,
              context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
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
      <Flex>
        <FlatList<FilterOptions>
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <TouchableOptionListItemRow onPress={() => navigateToNextFilterScreen(item.FilterScreenComponent)}>
                  <OptionListItem>
                    <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
                      <Sans size="3t" color="black100">
                        {item.filterText}
                      </Sans>
                      <Flex flexDirection="row">
                        {item.filterType === "color" ? (
                          colorSwatch(selectedOption(item.filterType) as ColorOption)
                        ) : (
                          <CurrentOption size="3">{selectedOption(item.filterType)}</CurrentOption>
                        )}
                        <ArrowRightIcon fill="black30" ml={0.3} mt={0.3} />
                      </Flex>
                    </Flex>
                  </OptionListItem>
                </TouchableOptionListItemRow>
              }
            </Box>
          )}
        />
      </Flex>
    </Flex>
  )
}

const colorSwatch = (colorOption: ColorOption) => {
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

const ModalInnerView = styled.View`
  flex-direction: column;
  background-color: ${color("white100")};
  height: 75%;
  border-top-left-radius: ${space(1)};
  border-top-right-radius: ${space(1)};
  overflow: hidden;
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
