import { ArrowLeftIcon, ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans, Serif } from "@artsy/palette"
import React from "react"
import { FlatList, LayoutAnimation, Modal as RNModal, TouchableWithoutFeedback, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"

export class FilterModalNavigator extends React.Component<FilterModalProps, FilterModalState> {
  state = {
    isComponentMounted: false,
    sortableItems: [],
  }

  componentDidMount() {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setState({ isComponentMounted: true })
    }, 100)
  }

  closeModal() {
    if (this.props.closeModal) {
      this.props.closeModal()
    }
  }

  render() {
    const { isFilterArtworksModalVisible } = this.props
    const { isComponentMounted } = this.state

    return (
      <>
        {isFilterArtworksModalVisible && (
          <RNModal animationType="fade" transparent={true} visible={isFilterArtworksModalVisible}>
            <TouchableWithoutFeedback onPress={null}>
              <ModalBackgroundView>
                <Flex onTouchStart={this.props.closeModal} style={{ flexGrow: 1 }} />
                <ModalInnerView visible={isComponentMounted}>
                  <NavigatorIOS
                    ref="filterNav"
                    navigationBarHidden={true}
                    initialRoute={{
                      component: FilterOptions,
                      title: "",
                      passProps: { closeModal: this.props.closeModal },
                    }}
                    style={{ flex: 1 }}
                  />
                  <Box p={2}>
                    <Button onPress={() => this.closeModal()} block width={100} variant="secondaryOutline">
                      Apply
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
}

class SortOptionsScreen extends React.Component<SortOptionsScreenProps> {
  handleBackNavigation() {
    this.props.navigator.pop()
  }

  renderSortOption = ({ item }) => {
    return (
      <ListItem>
        <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
          <Serif size="3">{item}</Serif>
        </Flex>
      </ListItem>
    )
  }

  render() {
    return (
      <Flex flexGrow={1}>
        <SortHeader>
          <Flex alignItems="flex-end" mt={0.5} mb={2}>
            <Box ml={2} mt={2} onTouchStart={() => this.handleBackNavigation()}>
              <ArrowLeftIcon fill="black100" />
            </Box>
          </Flex>
          <Sans mt={2} weight="medium" size="4">
            Sort
          </Sans>
          <Box></Box>
        </SortHeader>
        <Flex>
          <FlatList
            keyExtractor={(_item, index) => String(index)}
            data={SortOptions}
            renderItem={item => <Box>{this.renderSortOption(item)}</Box>}
          />
        </Flex>
        <BackgroundFill />
      </Flex>
    )
  }
}

class FilterOptions extends React.Component<FilterOptionsProps, FilterOptionsState> {
  state = {
    filterOptions: [],
  }

  componentDidMount() {
    const filterOptions = []

    filterOptions.push({
      type: "Sort by",
      onTap: this.handleNavigationToSortScreen,
    })

    this.setState({
      filterOptions,
    })
  }

  handleNavigationToSortScreen = () => {
    this.props.navigator.push({
      component: SortOptionsScreen,
    })
  }

  renderFilterOption = ({ item: { type, onTap } }) => {
    return (
      <ListItem>
        <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
          <Serif size="3">{type}</Serif>
          <Flex flexDirection="row" onTouchEnd={() => onTap()}>
            <Serif color={color("black60")} size="3">
              Default
            </Serif>
            <ArrowRightIcon fill="black30" ml={0.3} mt={0.3} />
          </Flex>
        </Flex>
      </ListItem>
    )
  }

  render() {
    const { filterOptions } = this.state

    return (
      <Flex flexGrow={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex alignItems="flex-end" mt={0.5} mb={2}>
            <Box ml={2} mt={2} onTouchStart={() => this.props.closeModal()}>
              <CloseIcon fill="black100" />
            </Box>
          </Flex>
          <Sans mt={2} weight="medium" size="4">
            Filter
          </Sans>
          <Sans mr={2} mt={2} size="4">
            Clear all
          </Sans>
        </Flex>
        <Flex>
          <FlatList
            keyExtractor={(_item, index) => String(index)}
            data={filterOptions}
            renderItem={item => <Box>{this.renderFilterOption(item)}</Box>}
          />
        </Flex>
        <BackgroundFill />
      </Flex>
    )
  }
}

const SortHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 20px;
`

const BackgroundFill = styled(Flex)`
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

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const ModalInnerView = styled.View<{ visible: boolean }>`
  flex-direction: column;
  background-color: white;
  height: 75%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const ListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  flex: 1;
  width: 100%;
`

const SortOptions = [
  "Default",
  "Price (low to high)",
  "Price (high to low)",
  "Recently Updated",
  "Recently Added",
  "Artwork year (descending)",
  "Artwork year (ascending)",
]

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
}

interface FilterModalState {
  isComponentMounted: boolean
  sortableItems: Array<{ type: string; data: any }>
}

interface SortOptionsScreenProps {
  navigator: NavigatorIOS
}

interface FilterOptionsState {
  filterOptions: Array<{ type: string; data: any }>
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
}

/**
 * TODOS:
 *
 * 3) Close modal on background click
 * 4) Add tests  (check out Bid Flow + Consignments flow)
 *  e.g. when you click sort the correct component renders in the nav stack
 * 5) Clean up all the old/unused code
 *
 */
