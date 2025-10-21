import { Box, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { Component } from "react"
import { Animated, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

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
  scrollValue?: Animated.AnimatedInterpolation<number>
  /** Should space tabs evenly */
  spaceEvenly?: boolean
}

const Underline = Animated.View

const Tabs = styled.View`
  height: 50px;
  flex-direction: row;
  justify-content: space-around;
`

const TabButton = styled.View<{ spaceEvenly?: boolean; active?: boolean }>`
  align-items: center;
  justify-content: center;
  padding-top: 5px;
  flex-grow: 1;
  ${(p: { spaceEvenly?: boolean; active?: boolean }) => p.spaceEvenly && `flex: 1;`};
  ${(p: { spaceEvenly?: boolean; active?: boolean }) =>
    !p.spaceEvenly &&
    p.active &&
    `
    border-color: ${themeGet("colors.mono100")};
    border-bottom-width: 1px;
    margin-bottom: -1px;
  `};
`

export default class TabBar extends Component<TabBarProps> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  renderTab(name, page, isTabActive, onPressHandler) {
    return (
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        key={name}
        accessible
        accessibilityLabel={name}
        accessibilityRole="button"
        onPress={() => onPressHandler(page)}
      >
        <TabButton spaceEvenly={this.props.spaceEvenly} active={isTabActive}>
          <ThemeAwareClassTheme>
            {({ color }) => (
              <Text
                variant="sm"
                numberOfLines={1}
                ellipsizeMode="tail"
                weight="medium"
                color={isTabActive ? "mono100" : color("mono30")}
              >
                {name}
              </Text>
            )}
          </ThemeAwareClassTheme>
        </TabButton>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <ThemeAwareClassTheme>
        {({ space, color }) => {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          const containerWidth = this.props.containerWidth - space(4)
          const numberOfTabs = this.props.tabs.length

          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
                        backgroundColor: color("mono100"),
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
        }}
      </ThemeAwareClassTheme>
    )
  }
}

const Wrapper = styled(Box)`
  border-bottom-width: 1px;
  border-bottom-color: ${themeGet("colors.mono30")};
`
