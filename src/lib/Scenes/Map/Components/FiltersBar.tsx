import { Box, color, Sans, Serif } from "@artsy/palette"
import { City } from "lib/Scenes/City/City"
import React from "react"
import { Animated, View } from "react-native"
import styled from "styled-components/native"

interface FiltersBarProps {
  currentCity: City
  goToPage?: () => null
  activeTab?: number
  tabs?: any[]
  containerWidth?: number
  scrollValue?: Animated.AnimatedInterpolation
}

interface FiltersBarState {
  activeTab: number
}

const Button = styled.TouchableWithoutFeedback`
  flex: 1;
`

const Tabs = styled.View`
  height: 50px;
  flex-direction: row;
  justify-content: space-around;
`

const TabButton = styled(View)<{ isActive: boolean }>`
  align-items: center;
  justify-content: center;
  padding-top: 5;
  flex: 1;
  ${p =>
    p.isActive &&
    `
    border-color: ${color("black100")};
    border-bottom-width: 2px;
  `};
`

export class FiltersBar extends React.Component<FiltersBarProps, FiltersBarState> {
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
      >
        <TabButton isActive={isTabActive}>
          <TabLabel size="3" weight="medium" isActive={isTabActive}>
            {name}
          </TabLabel>
        </TabButton>
      </Button>
    )
  }

  applyFilter = index => {
    this.setState({
      activeTab: index,
    })
  }

  render() {
    return (
      <>
        <Box pt={4} pb={2} px={3}>
          <Serif size="8">{this.props.currentCity.name}</Serif>
        </Box>
        <Tabs>
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.state.activeTab === page
            return this.renderTab(name, page, isTabActive, this.applyFilter)
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
