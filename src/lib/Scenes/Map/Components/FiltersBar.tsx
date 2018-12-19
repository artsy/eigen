import { Box, color, Sans, Serif } from "@artsy/palette"
import React from "react"
import { Animated } from "react-native"
import styled from "styled-components/native"

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
`

const TabButton = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: 5;
  flex: 1;
`

export class FiltersBar extends React.Component<TabBarProps, null> {
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
          <TabLabel size="3" weight="medium" isActive={isTabActive}>
            {name}
          </TabLabel>
        </TabButton>
      </Button>
    )
  }

  render() {
    return (
      <>
        <Box pt={4} pb={2} px={3}>
          <Serif size="8">Hong Kong</Serif>
        </Box>
        <Tabs>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page
            return this.renderTab(name, page, isTabActive, this.props.goToPage)
          })}
          <Animated.View
            style={[
              {
                position: "absolute",
                height: 1,
                backgroundColor: "black",
                bottom: -1,
                left: 0,
                right: 0,
              },
              {
                // transform: [{ translateX }],
              },
            ]}
          />
        </Tabs>
      </>
    )
  }
}

const TabLabel = styled(Sans)<{ isActive: boolean }>`
  color: ${p => (p.isActive ? color("black100") : color("black30"))};
`
