import { Box, color, Flex, Serif } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

interface Props {
  fairID: string
}

export class SearchLink extends React.Component<Props> {
  handlePress = () => {
    const { fairID } = this.props
    SwitchBoard.presentNavigationViewController(this, `/${fairID}/search`)
  }

  componentDidMount() {
    console.log("mounted")
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <Box background={color("black5")} height={46} px={2} py={1} mb={1}>
          <Flex alignItems="center" flexDirection="row" flexWrap="nowrap">
            <SearchIcon />
            <Box pt={0.3} ml={1}>
              <Serif color={color("black60")} size="3">
                Search exhibitors & artists
              </Serif>
            </Box>
          </Flex>
        </Box>
      </TouchableWithoutFeedback>
    )
  }
}
