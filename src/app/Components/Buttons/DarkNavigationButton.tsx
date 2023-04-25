import { Flex, Box, ClassTheme, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
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
      <ClassTheme>
        {({ color }) => (
          <Box px={2} py={1} style={{ backgroundColor: color("black100") }}>
            <TouchableWithoutFeedback onPress={this.openLink.bind(this)}>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text variant="sm" color={color("white100")}>
                  {this.props.title}
                </Text>
                {!!showNavArrow && (
                  <Image source={require("images/horizontal_chevron_white.webp")} />
                )}
              </Flex>
            </TouchableWithoutFeedback>
          </Box>
        )}
      </ClassTheme>
    )
  }

  openLink() {
    if (this.props.href) {
      navigate(this.props.href)
    } else if (this.props.onPress) {
      this.props.onPress()
    }
  }
}
