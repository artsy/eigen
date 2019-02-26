import { Box, color, Flex, Serif } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"

interface Props {
  _id: string
  id: string
}

const track: Track<Props> = _track

@track()
export class SearchLink extends React.Component<Props> {
  @track(params => {
    return {
      action_name: Schema.ActionNames.Search,
      action_type: Schema.ActionTypes.Tap,
      owner_id: params._id,
      owner_slug: params.id,
      owner_type: Schema.OwnerEntityTypes.Fair,
    } as any
  })
  handlePress() {
    const { id } = this.props
    SwitchBoard.presentNavigationViewController(this, `/${id}/search`)
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.handlePress}>
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
