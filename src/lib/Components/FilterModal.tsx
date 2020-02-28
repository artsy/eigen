import { ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans, Serif, space } from "@artsy/palette"
import React, { useContext, useEffect, useState } from "react"
import { FlatList, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { ArtworkFilterContext } from "../utils/ArtworkFiltersStore"
import { SortOptionsScreen as SortOptions, SortTypes } from "./ArtworkFilterOptions/SortOptions"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
}

type SortableItems = Array<{ type: string; data: any }>

export const FilterModalNavigator: React.SFC<FilterModalProps> = ({ closeModal, isFilterArtworksModalVisible }) => {
  const [sortableItems, setSortableItems] = useState<SortableItems>([])
  const { dispatch, state: globalFilterState } = useContext(ArtworkFilterContext)

  const handleClosingModal = () => {
    closeModal()
    dispatch({ type: "resetFilterCount" })
  }

  return (
    <>
      {isFilterArtworksModalVisible && (
        <RNModal animationType="fade" transparent={true} visible={isFilterArtworksModalVisible}>
          <TouchableWithoutFeedback onPress={null}>
            <ModalBackgroundView>
              <TouchableOpacity onPress={() => handleClosingModal()} style={{ flexGrow: 1 }} />
              <ModalInnerView>
                <NavigatorIOS
                  navigationBarHidden={true}
                  initialRoute={{
                    component: FilterOptions,
                    passProps: { closeModal },
                    title: "",
                  }}
                  style={{ flex: 1 }}
                />
                <Box p={2}>
                  <Button onPress={null} block width={100} variant="secondaryOutline">
                    {globalFilterState.filterCount > 0 ? "Apply" + " (" + globalFilterState.filterCount + ")" : "Apply"}
                  </Button>
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
}

type FilterOptions = Array<{ type: string; onTap: () => void }>
type SelectedSortOption = SortTypes

export const FilterOptions: React.SFC<FilterOptionsProps> = ({ closeModal, navigator }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>([])
  const [selectedSortOption, setSelectedSortOption] = useState<SelectedSortOption>("Default")
  const { dispatch } = useContext(ArtworkFilterContext)

  useEffect(() => {
    const filterCategories = []

    filterCategories.push({
      type: "Sort by",
      onTap: handleNavigationToSortScreen,
    })

    setFilterOptions(filterCategories)
  }, [])

  const handleNavigationToSortScreen = () => {
    navigator.push({
      component: SortOptions,
      passProps: {
        updateSortOption: (sortOption: SortTypes) => getSortSelection(sortOption),
        sortScreenSortSelection: selectedSortOption,
      },
    })
  }

  const getSortSelection = (sortOption: SortTypes) => {
    setSelectedSortOption(sortOption)
  }

  const clearAllFilters = () => {
    setSelectedSortOption("Default")
    dispatch({ type: "resetFilterCount" })
  }

  const handleTappingCloseIcon = () => {
    closeModal()
    dispatch({ type: "resetFilterCount" })
  }

  return (
    <Flex flexGrow={1}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <CloseIconContainer onPress={() => handleTappingCloseIcon()}>
            <CloseIcon fill="black100" />
          </CloseIconContainer>
        </Flex>
        <FilterHeader weight="medium" size="4">
          Filter
        </FilterHeader>
        <TouchableOpacity onPress={() => clearAllFilters()}>
          <Sans mr={2} mt={2} size="4">
            Clear all
          </Sans>
        </TouchableOpacity>
      </Flex>
      <Flex>
        <FlatList<{ onTap: () => void; type: string }>
          keyExtractor={(_item, index) => String(index)}
          data={filterOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <TouchableOptionListItemRow onPress={() => item.onTap()}>
                  <OptionListItem>
                    <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
                      <Serif size="3">{item.type}</Serif>
                      <Flex flexDirection="row">
                        <CurrentOption size="3">{selectedSortOption}</CurrentOption>
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
`

export const BackgroundFill = styled(Flex)`
  background-color: ${color("black10")};
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

export const CurrentOption = styled(Serif)`
  color: ${color("black60")};
`
