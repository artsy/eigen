import { Box, color, Flex, Serif } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Image, TouchableWithoutFeedback } from "react-native"

interface Props extends React.Props<DarkNavigationButton> {
  href?: string
  onPress?: () => void
  title: string
}

export default class DarkNavigationButton extends React.Component<Props, any> {
  render() {
    const showNavArrow = this.props.href || this.props.onPress
    return (
      <Box px={2} py={1} style={{ backgroundColor: color("black100") }}>
        <TouchableWithoutFeedback onPress={this.openLink.bind(this)}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Serif color={color("white100")} size="3t">
              {this.props.title}
            </Serif>
            {!!showNavArrow && <Image source={require("../../../../images/horizontal_chevron_white.png")} />}
          </Flex>
        </TouchableWithoutFeedback>
      </Box>
    )
  }

  openLink() {
    if (this.props.href) {
      SwitchBoard.presentNavigationViewController(this, this.props.href)
    } else if (this.props.onPress) {
      this.props.onPress()
    }
  }
}
