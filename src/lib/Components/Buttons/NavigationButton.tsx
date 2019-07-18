import { Box, Flex, Sans, Separator, Theme } from "@artsy/palette"
import ChevronIcon from "lib/Icons/ChevronIcon"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableWithoutFeedback, View } from "react-native"

interface Props extends React.Props<NavigationButton> {
  href: string
  title: string
  style?: any
}

export default class NavigationButton extends React.Component<Props, any> {
  render() {
    return (
      <Theme>
        <View style={[{ marginBottom: 20, marginLeft: 20, marginRight: 20 }, this.props.style]}>
          <TouchableWithoutFeedback onPress={this.openLink.bind(this)}>
            <Box>
              <Separator mb={1} />
              <Flex flexDirection="row" alignItems="center" flexWrap="nowrap" justifyContent="space-between">
                <Sans size="3" weight="medium">
                  {this.props.title}
                </Sans>
                <ChevronIcon />
              </Flex>
              <Separator mt={1} />
            </Box>
          </TouchableWithoutFeedback>
        </View>
      </Theme>
    )
  }

  openLink() {
    SwitchBoard.presentNavigationViewController(this, this.props.href)
  }
}
