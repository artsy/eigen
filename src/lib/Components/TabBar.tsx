import React from "react"
import { Animated, View } from "react-native"
import styled from "styled-components/native"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"

interface TabBarProps {
  goToPage?: () => null
  activeTab?: number
  tabs?: any[]
  containerWidth?: number
  scrollValue?: Animated.AnimatedInterpolation
}
const Button = styled.TouchableWithoutFeedback`
  flex: 1;
`

const Tabs = styled.View`
  height: 50px;
  flex-direction: row;
  justify-content: space-around;
  border-color: ${colors["gray-medium"]};
  border-bottom-width: 1px;
`

const TabButton = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: 5;
  flex: 1;
`

interface TabProps {
  tabLabel: string
}

interface TabLabelProps {
  active: boolean
}

const TabLabel: any = styled.Text`
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 13px;
  letter-spacing: 1.5;
  text-align: center;
  color: ${(props: TabLabelProps) => (props.active ? "black" : colors["gray-medium"])};
`

export const Tab: React.SFC<TabProps> = ({ children }) => <View style={{ flex: 1 }}>{children}</View>

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
        <TabButton>
          <TabLabel active={isTabActive}>{name.toUpperCase()}</TabLabel>
        </TabButton>
      </Button>
    )
  }

  render() {
    const containerWidth = this.props.containerWidth
    const numberOfTabs = this.props.tabs.length

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, containerWidth / numberOfTabs],
    })

    return (
      <Tabs>
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
