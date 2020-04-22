import { ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans, space } from "@artsy/palette"
import { Collection_collection } from "__generated__/Collection_collection.graphql"
import {
  changedFiltersParams,
  filterArtworksParams,
  FilterOption,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import React, { useContext } from "react"
import { FlatList, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "../utils/ArtworkFiltersStore"
import { MediumOptionsScreen } from "./ArtworkFilterOptions/MediumOptions"
import { PriceRangeOptionsScreen } from "./ArtworkFilterOptions/PriceRangeOptions"
import { SortOptionsScreen } from "./ArtworkFilterOptions/SortOptions"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  exitModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
  collection: Collection_collection
}

export const FilterModalNavigator: React.SFC<FilterModalProps> = props => {
  const tracking = useTracking()

  const { closeModal, exitModal, isFilterArtworksModalVisible, collection } = props
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const { id, slug } = collection

  const handleClosingModal = () => {
    dispatch({ type: "resetFilters" })
    closeModal()
  }

  const applyFilters = () => {
    dispatch({ type: "applyFilters" })
    exitModal()
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
        <RNModal animationType="fade" transparent={true} visible={isFilterArtworksModalVisible}>
          <TouchableWithoutFeedback onPress={null}>
            <ModalBackgroundView>
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
                <Box p={2}>
                  <ApplyButton
                    disabled={!isApplyButtonEnabled}
                    onPress={() => {
                      const appliedFiltersParams = filterArtworksParams(state.appliedFilters)

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
                </Box>
              </ModalInnerView>
            </ModalBackgroundView>
          </TouchableWithoutFeedback>
        </RNModal>
      )}
    </>
  )
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
  id: Collection_collection["id"]
  slug: Collection_collection["slug"]
}

interface FilterOptions {
  filterType: FilterOption
  filterText: string
  FilterScreenComponent: React.SFC<any>
}

export const FilterOptions: React.SFC<FilterOptionsProps> = props => {
  const tracking = useTracking()
  const { closeModal, navigator, id, slug } = props

  const { dispatch } = useContext(ArtworkFilterContext)

  const navigateToNextFilterScreen = NextComponent => {
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
  ]

  const clearAllFilters = () => {
    dispatch({ type: "clearAll" })
  }

  const handleTappingCloseIcon = () => {
    closeModal()
  }

  const selectedOptions = useSelectedOptionsDisplay()

  const selectedOption = (filterType: FilterOption) => {
    return selectedOptions.find(option => option.filterType === filterType)?.value
  }

  return (
    <Flex flexGrow={1}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <CloseIconContainer onPress={handleTappingCloseIcon}>
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
      </Flex>
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
                        <CurrentOption size="3">{selectedOption(item.filterType)}</CurrentOption>
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
      <BackgroundFill />
    </Flex>
  )
}

export const FilterHeader = styled(Sans)`
  margin-top: 20px;
  padding-left: 35px;
`

export const BackgroundFill = styled(Flex)`
  flex-grow: 1;
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
  margin-left: ${space(2)};
  margin-top: ${space(2)};
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  flex: 1;
  width: 100%;
`

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
  border-top-left-radius: ${space(1)};
  border-top-right-radius: ${space(1)};
`

const ModalInnerView = styled.View`
  flex-direction: column;
  background-color: ${color("white100")};
  height: 75%;
  border-top-left-radius: ${space(1)};
  border-top-right-radius: ${space(1)};
`

export const CurrentOption = styled(Sans)`
  color: ${color("black60")};
`
export const ClearAllButton = styled(TouchableOpacity)``
export const ApplyButton = styled(Button)``
