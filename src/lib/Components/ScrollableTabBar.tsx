import { color, Sans } from "@artsy/palette"
import React from "react"
import { Animated, Dimensions, LayoutRectangle, ScrollView, View } from "react-native"
import styled from "styled-components/native"

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
  height: 50px;
  flex: 1;
`

const Tabs = styled.ScrollView`
  height: 50px;
  border-bottom-width: 1px;
  border-color: ${color("black10")};
`

const TabButton = styled(View)<{ active: boolean }>`
  align-items: center;
  justify-content: center;
  height: 50px;
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

const TabLabel = styled(Sans)<{ isActive: boolean }>`
  color: ${p => (p.isActive ? color("black100") : color("black30"))};
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
  delayPressTimeout: any
  els: LayoutRectangle[] = []

  state = {
    activeTab: this.props.activeTab || 0,
  }

  componentWillReceiveProps(newProps: ScrollableTabBarProps) {
    this.centerOnTab(newProps.activeTab)
  }

  renderTab = (name, page, isTabActive, onPressHandler) => {
    return (
      <Button
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onLayout={e => {
          const layout = e.nativeEvent.layout
          this.els[page] = layout
        }}
        onPress={() => {
          this.setState({
            activeTab: page,
          })

          clearTimeout(this.delayPressTimeout)
          this.delayPressTimeout = setTimeout(() => {
            onPressHandler(page)
          }, 500)
        }}
      >
        <TabButton active={isTabActive}>
          <TabLabel size="3" isActive={isTabActive}>
            {name}
          </TabLabel>
        </TabButton>
      </Button>
    )
  }

  centerOnTab = (index: number) => {
    if (!this.els[index] || !this.scrollView) {
      return
    }

    const { width: screenWidth } = Dimensions.get("window")
    // If the scrollview doesn't need to scroll, don't try to scroll it!
    if (this.scrollViewWidth < screenWidth) {
      return
    }

    const { x, width } = this.els[index]
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
      <Tabs
        ref={(r: any) => {
          if (r) {
            this.scrollView = r.root
          }
        }}
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", justifyContent: "space-between" }}
        onContentSizeChange={width => (this.scrollViewWidth = width)}
        horizontal
      >
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page
          return this.renderTab(name, page, isTabActive, this.props.goToPage)
        })}
      </Tabs>
    )
  }
}
