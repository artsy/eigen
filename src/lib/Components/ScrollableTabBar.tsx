import { color, Flex } from "@artsy/palette"
import React from "react"
import { Animated, Dimensions, LayoutRectangle, ScrollView, View } from "react-native"
import styled from "styled-components/native"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"

export interface Tab {
  id: string
  text: string
}

interface ScrollableTabBarProps {
  goToPage?: () => null
  activeTab?: number
  tabs?: Tab[]
  containerWidth?: number
  scrollValue?: Animated.AnimatedInterpolation
}
const Button = styled.TouchableWithoutFeedback`
  flex: 1;
`

const Tabs = styled.ScrollView`
  height: 50px;
  flex-direction: row;
  border-color: ${colors["gray-medium"]};
`

const TabButton = styled(Flex)<{ active: boolean }>`
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  flex-grow: 1;
  ${p =>
    p.active &&
    `
    border-color: ${color("black100")};
    border-bottom-width: 2px;
  `};
`

interface ScrollableTabProps {
  tabLabel: string
}

interface ScrollableTabLabelProps {
  active: boolean
}

const TabLabel: any = styled.Text`
  font-family: ${fonts["unica77ll-regular"]};
  font-size: 13px;
  text-align: center;
  color: ${(props: ScrollableTabLabelProps) => (props.active ? "black" : colors["gray-medium"])};
`

export const ScrollableTab: React.SFC<ScrollableTabProps> = ({ children }) => (
  <View style={{ flex: 1, overflow: "hidden" }}>{children}</View>
)

export interface ScrollableTabBarState {
  activeTab: number
}
export default class ScrollableTabBar extends React.Component<ScrollableTabBarProps, ScrollableTabBarState> {
  scrollView: ScrollView = null
  // Default to screen width under first render
  scrollViewWidth: number = Dimensions.get("window").width
  els: LayoutRectangle[] = []

  state = {
    activeTab: this.props.activeTab || 0,
  }

  renderTab(name, page, isTabActive, onPressHandler) {
    return (
      <Button
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
        onLayout={e => {
          const layout = e.nativeEvent.layout
          this.els[page] = layout

          if (page === this.state.activeTab) {
            this.centerOnTab(page)
          }
        }}
      >
        <TabButton active={isTabActive}>
          <TabLabel active={isTabActive}>{name}</TabLabel>
        </TabButton>
      </Button>
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
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    })

    return (
      <Tabs
        ref={(r: any) => {
          if (r) {
            this.scrollView = r.root
          }
        }}
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", justifyContent: "space-around" }}
        onContentSizeChange={width => (this.scrollViewWidth = width)}
        horizontal
      >
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page
          return this.renderTab(name, page, isTabActive, this.props.goToPage)
        })}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: containerWidth / numberOfTabs,
              height: 1,
              backgroundColor: "black",
              bottom: -1,
              left: 0,
              right: 0,
            },
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Tabs>
    )
  }
}
