import { Box, color } from "@artsy/palette"
import { SavedShowItemRow_show } from "__generated__/SavedShowItemRow_show.graphql"
import { SavedShowItemRow } from "lib/Components/Lists/SavedShowItemRow"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

const shadowDetails: any = {
  shadowRadius: 6,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
}

const Background = styled(Box)`
  background: ${color("white100")};
  height: 106;
  border-radius: 2px;
`

interface ShowCardProps {
  show: SavedShowItemRow_show
  onSave?: () => void
}

export class ShowCard extends Component<ShowCardProps> {
  handleTap() {
    const path = this.props.show.href
    SwitchBoard.presentNavigationViewController(this, path)

    if (this.props.onSave) {
      this.props.onSave()
    }
  }

  render() {
    const { show } = this.props
    return (
      <Background m={1} px={2} style={shadowDetails}>
        {show && (
          <TouchableOpacity onPress={this.handleTap.bind(this)}>
            <SavedShowItemRow show={show} />
          </TouchableOpacity>
        )}
      </Background>
    )
  }
}
