import { ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans, Serif } from "@artsy/palette"
import { SortOptions } from "lib/data/ArtworkFilterOptions"
import React from "react"
import { FlatList, LayoutAnimation, Modal as RNModal, TouchableWithoutFeedback, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
// import { SortOptionsScreen } from "./SortOptionsScreen"

interface ModalProps extends ViewProperties {
  // visible: boolean
  closeModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
}

// TODO:  Define a TypeScript interface to represent possible filter states (take a look at the Pick TypeScript generic)
interface State {
  isComponentMounted: boolean
  sortableItems: Array<{ type: string; data: any }>
  currentSortOrder: SortOptions
}

export class FilterModalNavigator extends React.Component<ModalProps, State> {
  state = {
    isComponentMounted: false,
    sortableItems: [],
    currentSortOrder: SortOptions.Default,
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

  getDefaultSort(type) {
    switch (type) {
      case "Sort by":
        return this.state.currentSortOrder
    }
  }

  _handleBackPress() {
    this.props.navigator.pop()
  }

  handleNextPress(type) {
    console.log("navvvvvv", this)

    return this.refs.filterNav.navigator.push({
      title: "Sort Modal",
      component: SortOptionsScreen,
      passProps: { ...this.props },
    })
  }
  render() {
    const { sortableItems } = this.state
    const { isFilterArtworksModalVisible } = this.props

    return (
      <>
        {isFilterArtworksModalVisible && (
          <RNModal animationType="fade" transparent={true} visible={isFilterArtworksModalVisible}>
            <TouchableWithoutFeedback onPress={null}>
              <ModalBackgroundView>
                <Flex onTouchStart={null} style={{ flexGrow: 1 }} />
                <ModalInnerView visible={this.state.isComponentMounted}>
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

const ClickDefault = styled(Flex)`
  border: solid 5px hotpink;
`

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
`

const ModalInnerView = styled.View<{ visible: boolean }>`
  flex-direction: column;
  background-color: white;
  height: 300px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const SortRowItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  border: solid 1px ${color("black10")};
  border-bottom-width: 0;
  border-right-width: 0;
  border-left-width: 0;
  flex: 1;
  width: 100%;
`

class SortOptionsScreen extends React.Component {
  goBack() {
    this.props.navigator.pop()
  }

  render() {
    return (
      <Flex>
        <SortRowItem>
          <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
            <Serif size="3">Sort By</Serif>
            <Flex flexDirection="row" onTouchEnd={null}>
              <Serif color={color("black60")} size="3">
                Sort By
              </Serif>
              <ArrowRightIcon fill="black30" ml={0.3} mt={0.3} />
            </Flex>
          </Flex>
        </SortRowItem>
      </Flex>
    )
  }
}

interface FilterOptionsState {
  sortableItems: Array<{ type: string; data: any }>
}

interface FilterOptionsProps {
  closeModal: () => void
}

class FilterOptions extends React.Component<FilterOptionsProps, FilterOptionsState> {
  state = {
    sortableItems: [],
  }

  // TODO: Rename "sortableItem" --> Filter Options
  componentDidMount() {
    const sortableItems = []

    sortableItems.push({
      type: "Sort by",
      data: {
        sort: [],
      },
    })

    this.setState({
      sortableItems,
    })
  }

  renderFilterOption = ({ item: { type } }) => {
    return (
      <SortRowItem>
        <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
          <Serif size="3">{type}</Serif>
          <Flex flexDirection="row" onTouchEnd={null}>
            <Serif color={color("black60")} size="3">
              Default
            </Serif>
            <ArrowRightIcon fill="black30" ml={0.3} mt={0.3} />
          </Flex>
        </Flex>
      </SortRowItem>
    )
  }

  render() {
    const { sortableItems } = this.state

    return (
      <Flex>
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
        <FlatList
          keyExtractor={(_item, index) => String(index)}
          data={sortableItems}
          renderItem={item => <Box>{this.renderFilterOption(item)}</Box>}
        />
      </Flex>
    )
  }
}
