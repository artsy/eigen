import React from "react"
import { Animated, View } from "react-native"
import styled from "styled-components/native"

import { Box, color, Sans, space } from "@artsy/palette"

/**
 * Nearly all props are given by the ScrollableTabView,
 * these are prefixed with Auto:
 */
interface TabBarProps {
  /** Auto: A list of strings for the buttons */
  tabs: string[]
  /** Auto:  A callback for usage in the tab buttons */
  goToPage?: () => null
  /** Auto: The index of the currently active tab */
  activeTab?: number
  /** Auto: How much horiztonal space do you have */
  containerWidth?: number
  /** Auto: Handled by ScrollableTabView */
  scrollValue?: Animated.AnimatedInterpolation
  /** Should space tabs evenly */
  spaceEvenly?: boolean
}

const Button = styled.TouchableWithoutFeedback`
  flex: 1;
`

const Underline = Animated.View

const Tabs = styled.View`
  height: 50px;
  flex-direction: row;
  justify-content: space-around;
`

const TabButton = styled.View<{ spaceEvenly?: boolean; active?: boolean }>`
  align-items: center;
  justify-content: center;
  padding-top: 5;
  flex-grow: 1;
  ${p => p.spaceEvenly && `flex: 1;`};
  ${p =>
    !p.spaceEvenly &&
    p.active &&
    `
    background-color: red;
    border-color: ${color("black100")};
    border-bottom-width: 1px;
    margin-bottom: -1px;
  `};
`

interface TabProps {
  tabLabel: string
}

export const Tab: React.SFC<TabProps> = ({ children }) => (
  <View style={{ flex: 1, overflow: "hidden" }}>{children}</View>
)

export default class TabBar extends React.Component<TabBarProps, null> {
  renderTab(name, page, isTabActive, onPressHandler) {
    return (
      <Button
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <TabButton spaceEvenly={this.props.spaceEvenly} active={isTabActive}>
          <Sans
            numberOfLines={1}
            ellipsizeMode="tail"
            weight="medium"
            size="3"
            color={isTabActive ? "black" : color("black30")}
          >
            {name}
          </Sans>
        </TabButton>
      </Button>
    )
  }

  render() {
    const containerWidth = this.props.containerWidth - space(4)
    const numberOfTabs = this.props.tabs.length

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    })

    return (
      <Wrapper px={2}>
        <Tabs>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page
            return this.renderTab(name, page, isTabActive, this.props.goToPage)
          })}
          {this.props.spaceEvenly ? (
            <Underline
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
          ) : null}
        </Tabs>
      </Wrapper>
    )
  }
}

const Wrapper = styled(Box)`
  border-bottom-width: 1px;
  border-bottom-color: ${color("black30")};
`
