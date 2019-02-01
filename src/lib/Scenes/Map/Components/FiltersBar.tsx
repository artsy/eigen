import { Box, color, Sans, Serif } from "@artsy/palette"
import { City } from "lib/Scenes/City/City"
import React from "react"
import { Animated, Dimensions, LayoutRectangle, ScrollView, View } from "react-native"
import styled from "styled-components/native"

export interface Tab {
  id: string
  text: string
}
export interface FiltersBarProps {
  currentCity: City
  goToPage?: (number) => void
  activeTab?: number
  tabs?: Tab[]
  containerWidth?: number
  scrollValue?: Animated.AnimatedInterpolation
}

export interface FiltersBarState {
  activeTab: number
}

const Button = styled.TouchableWithoutFeedback`
  height: 50px;
`

const Tabs = styled.ScrollView`
  height: 50px;
`

const TabButton = styled(View)<{ isActive: boolean }>`
  align-items: center;
  justify-content: center;
  height: 50;
  padding-left: 20px;
  padding-right: 20px;
  ${p =>
    p.isActive &&
    `
    border-color: ${color("black100")};
    border-bottom-width: 2px;
  `};
`

export class FiltersBar extends React.Component<FiltersBarProps, FiltersBarState> {
  scrollView: ScrollView = null
  // Default to screen width under first render
  scrollViewWidth: number = Dimensions.get("window").width
  els: LayoutRectangle[] = []

  state = {
    activeTab: this.props.activeTab || 0,
  }

  renderTab(tab: Tab, page: number, isTabActive: boolean, onPressHandler: (page: number) => void) {
    return (
      <Button
        key={tab.id}
        accessible={true}
        accessibilityLabel={tab.text}
        accessibilityTraits="button"
        onPress={onPressHandler.bind(this, page)}
        onLayout={e => {
          const layout = e.nativeEvent.layout
          this.els[page] = layout

          if (page === this.state.activeTab) {
            this.centerOnTab(page)
          }
        }}
      >
        <TabButton isActive={isTabActive}>
          <TabLabel size="3" weight="medium" isActive={isTabActive}>
            {tab.text}
          </TabLabel>
        </TabButton>
      </Button>
    )
  }

  applyFilter = (index: number) => {
    this.centerOnTab(index)
    this.setState(
      {
        activeTab: index,
      },
      () => this.props.goToPage && this.props.goToPage(index)
    )
  }

  centerOnTab = (index: number) => {
    const { x, width } = this.els[index]
    const { width: screenWidth } = Dimensions.get("window")
    const maxOffset = this.scrollViewWidth - screenWidth
    const xOffset = x + width / 2 - screenWidth / 2

    if (xOffset < 0) {
      this.scrollView.scrollTo({ x: 0, y: 0 })
    } else if (xOffset > maxOffset) {
      this.scrollView.scrollTo({ x: maxOffset, y: 0 })
    } else {
      this.scrollView.scrollTo({ x: xOffset, y: 0 })
    }
  }

  render() {
    return (
      <View>
        <Box pt={4} pb={2} px={3}>
          <Serif size="8">{this.props.currentCity.name}</Serif>
        </Box>
        <Tabs
          ref={(r: any) => {
            if (r) {
              this.scrollView = r.root
            }
          }}
          alwaysBounceVertical={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: "row" }}
          onContentSizeChange={width => (this.scrollViewWidth = width)}
          horizontal
        >
          {this.props.tabs.map((tab, page) => {
            const isTabActive = this.state.activeTab === page
            return this.renderTab(tab, page, isTabActive, this.applyFilter)
          })}
        </Tabs>
      </View>
    )
  }
}

const TabLabel = styled(Sans)<{ isActive: boolean }>`
  color: ${p => (p.isActive ? color("black100") : color("black30"))};
`
